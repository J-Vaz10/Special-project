import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SOSButton } from '@/components/SOSButton';
import { StepTracker, type Paso } from '@/components/StepTracker';
import { PrimaryButton } from '@/components/PrimaryButton';
import { QRScannerModal } from '@/components/QRScannerModal';
import { PinBackupModal } from '@/components/PinBackupModal';
import { shipmentsService } from '@/services/shipmentsService';
import { colors, radius, spacing } from '@/theme/colors';
import type { Envio, TipoValidacion } from '@/types';

const PASOS: Paso[] = [
  { key: 'recoger', label: 'Recoger', icon: 'storefront-outline' },
  { key: 'transito', label: 'En Tránsito', icon: 'bicycle' },
  { key: 'pudo', label: 'PUDO', icon: 'flag-outline' },
];

function pasoActivoPara(envio: Envio): number {
  if (envio.estado === 'asignado') return 0;
  if (envio.estado === 'en_transito') return 1;
  return 2; // entregado o incidente
}

/** Paso 3: Módulo de Escáner y Doble Validación (RF-22, RF-23, RF-24, RF-25; RNF-09). */
export default function ValidarEntregaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [envio, setEnvio] = useState<Envio | null>(null);
  const [cargando, setCargando] = useState(true);
  const [validando, setValidando] = useState(false);
  const [modalQR, setModalQR] = useState(false);
  const [modalPIN, setModalPIN] = useState(false);

  const cargar = useCallback(async () => {
    if (!id) return;
    const encontrado = await shipmentsService.getEnvio(id);
    setEnvio(encontrado ?? null);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      let activo = true;
      setCargando(true);
      cargar().finally(() => {
        if (activo) setCargando(false);
      });
      return () => {
        activo = false;
      };
    }, [cargar]),
  );

  if (cargando || !envio) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const tipoActual: TipoValidacion = envio.estado === 'en_transito' ? 'entrega' : 'recoleccion';
  const yaEntregado = envio.estado === 'entregado';

  async function procesarValidacion(metodo: 'qr' | 'pin', valor: string) {
    setValidando(true);
    try {
      const resultado = await shipmentsService.validarCodigo(envio!.id, tipoActual, metodo, valor);
      if (resultado.ok && resultado.envio) {
        setEnvio(resultado.envio);
        setModalQR(false);
        setModalPIN(false);
        Alert.alert(resultado.envio.estado === 'entregado' ? '¡Entrega completada!' : 'Recolección confirmada', resultado.mensaje);
      } else {
        Alert.alert('No se pudo validar', resultado.mensaje);
      }
    } finally {
      setValidando(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        eyebrow={`Entrega activa: ${envio.id}`}
        title={envio.destinoPudo.nombre}
        onBack={() => router.back()}
        right={<SOSButton envioId={envio.id} />}
        bottom={
          <View style={{ marginTop: spacing.lg }}>
            <StepTracker pasos={PASOS} pasoActivo={pasoActivoPara(envio)} />
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.contenido}>
        <View style={styles.origenRow}>
          <Ionicons name="storefront-outline" size={16} color={colors.textMuted} />
          <Text style={styles.origenTexto}>Origen: {envio.comercioNombre}</Text>
        </View>

        {yaEntregado ? (
          <View style={styles.exitoCard}>
            <Ionicons name="checkmark-circle" size={40} color={colors.success} />
            <Text style={styles.exitoTitulo}>Entrega confirmada</Text>
            <Text style={styles.exitoTexto}>
              El comprador ya retiró su paquete en {envio.destinoPudo.nombre}. ¡Buen trabajo!
            </Text>
            <PrimaryButton label="Volver a la bolsa de envíos" onPress={() => router.replace('/repartidor')} />
          </View>
        ) : (
          <View style={styles.validacionCard}>
            <Text style={styles.validacionTitulo}>Doble Validación Requerida</Text>
            <View style={styles.pasoInstruccion}>
              <Text style={styles.pasoNumero}>1</Text>
              <Text style={[styles.pasoTexto, tipoActual === 'recoleccion' && styles.pasoTextoActivo]}>
                Escanea el QR del Comerciante al recibir el paquete.
              </Text>
            </View>
            <View style={styles.pasoInstruccion}>
              <Text style={styles.pasoNumero}>2</Text>
              <Text style={[styles.pasoTexto, tipoActual === 'entrega' && styles.pasoTextoActivo]}>
                Escanea el QR en el Punto {envio.destinoPudo.nombre} para validar la entrega definitiva.
              </Text>
            </View>

            <View style={styles.avisoBox}>
              <Ionicons name="cloud-offline-outline" size={16} color={colors.warning} />
              <Text style={styles.avisoTexto}>
                ¿Sin datos o señal inestable? Usa el PIN de respaldo para validar sin conexión.
              </Text>
            </View>

            <PrimaryButton
              label="Escanear QR"
              icon={<Ionicons name="qr-code-outline" size={18} color={colors.white} />}
              onPress={() => setModalQR(true)}
              disabled={validando}
            />
            <PrimaryButton
              label="Ingresar PIN de respaldo"
              variant="secondary"
              icon={<Ionicons name="keypad-outline" size={18} color={colors.navy} />}
              onPress={() => setModalPIN(true)}
              disabled={validando}
            />
          </View>
        )}
      </ScrollView>

      <QRScannerModal
        visible={modalQR}
        titulo={tipoActual === 'recoleccion' ? 'Escanea el QR del comerciante' : 'Escanea el QR del comprador'}
        instrucciones="Centra el código QR dentro del marco para validar automáticamente."
        onClose={() => setModalQR(false)}
        onScanned={(data) => procesarValidacion('qr', data)}
        testCode={tipoActual === 'recoleccion' ? envio.qrRecoleccion : envio.qrEntrega}
      />

      <PinBackupModal
        visible={modalPIN}
        onClose={() => setModalPIN(false)}
        onSubmit={(pin) => procesarValidacion('pin', pin)}
        loading={validando}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  contenido: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  origenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  origenTexto: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  validacionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  validacionTitulo: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  pasoInstruccion: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  pasoNumero: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surfaceMuted,
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 20,
    overflow: 'hidden',
  },
  pasoTexto: {
    flex: 1,
    fontSize: 13,
    color: colors.textSubtle,
  },
  pasoTextoActivo: {
    color: colors.text,
    fontWeight: '700',
  },
  avisoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.warningSoft,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  avisoTexto: {
    flex: 1,
    fontSize: 12,
    color: colors.warning,
    fontWeight: '600',
  },
  exitoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  exitoTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  exitoTexto: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
