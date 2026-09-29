import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ScreenHeader';
import { RouteMap } from '@/components/RouteMap';
import { PudoInfoCard } from '@/components/PudoInfoCard';
import { CodigoEntregaCard } from '@/components/CodigoEntregaCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { RatingModal } from '@/components/RatingModal';
import { ReportarProblemaModal } from '@/components/ReportarProblemaModal';
import { shipmentsService } from '@/services/shipmentsService';
import { colors, radius, spacing } from '@/theme/colors';
import { estimarMinutos, tiempoRelativo } from '@/utils/format';
import type { Envio } from '@/types';

const ESTADO_COPY: Record<Envio['estado'], { titulo: string; detalle: string; tono: 'primary' | 'success' | 'neutral' }> = {
  creado: {
    titulo: 'Buscando repartidor',
    detalle: 'Tu pedido fue creado y estamos asignando un repartidor colaborativo.',
    tono: 'neutral',
  },
  asignado: {
    titulo: 'Repartidor asignado',
    detalle: 'El repartidor va en camino a recoger tu paquete en el comercio.',
    tono: 'primary',
  },
  en_transito: {
    titulo: 'Repartidor en camino',
    detalle: 'Tu paquete va en camino al punto de encuentro seguro.',
    tono: 'primary',
  },
  entregado: {
    titulo: 'Listo para recoger',
    detalle: 'Tu paquete ya está en custodia en el punto PUDO, listo para que lo retires.',
    tono: 'success',
  },
  incidente: {
    titulo: 'Reporte en revisión',
    detalle: 'Estamos revisando un incidente reportado sobre este envío.',
    tono: 'neutral',
  },
};

/** Paso 4: App Comprador — rastreo en tiempo real (RF-18, RF-26, RF-27) y calificación (RF-29). */
export default function SeguimientoCompradorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [envio, setEnvio] = useState<Envio | null>(null);
  const [cargando, setCargando] = useState(true);
  const [modalCalificar, setModalCalificar] = useState(false);
  const [modalProblema, setModalProblema] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [yaCalifico, setYaCalifico] = useState(false);

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

  const copy = ESTADO_COPY[envio.estado];
  const medioPrincipal = envio.transporteRecomendado[0] ?? 'bicicleta';
  const minutosEstimados = estimarMinutos(envio.distanciaKm, medioPrincipal);

  async function handleCalificar(estrellas: 1 | 2 | 3 | 4 | 5, comentario?: string) {
    setEnviando(true);
    try {
      await shipmentsService.calificarEntrega({
        envioId: envio!.id,
        autor: 'comprador',
        estrellas,
        comentario,
      });
      setModalCalificar(false);
      setYaCalifico(true);
      Alert.alert('¡Gracias!', 'Tu calificación ayuda a mejorar la red de repartidores COBOX.');
    } finally {
      setEnviando(false);
    }
  }

  async function handleReportar(motivo: string, detalle?: string) {
    setEnviando(true);
    try {
      await shipmentsService.reportarIncidente({
        envioId: envio!.id,
        reportadoPor: 'comprador',
        motivo,
        detalle,
      });
      setModalProblema(false);
      Alert.alert('Reporte enviado', 'Soporte COBOX revisará tu caso y te contactará.');
      cargar();
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        eyebrow="Seguimiento de tu compra"
        title={copy.titulo}
        onBack={() => router.back()}
        subtitle={`Pedido ${envio.id}`}
      />

      <ScrollView contentContainerStyle={styles.contenido}>
        <View
          style={[
            styles.bannerCard,
            copy.tono === 'success' ? styles.bannerExito : styles.bannerInfo,
          ]}
        >
          <Ionicons
            name={copy.tono === 'success' ? 'checkmark-circle' : 'navigate-circle'}
            size={22}
            color={copy.tono === 'success' ? colors.success : colors.primaryDark}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitulo}>{copy.detalle}</Text>
            {envio.estado === 'en_transito' ? (
              <Text style={styles.bannerEta}>
                Llega en {minutosEstimados} min a {envio.destinoPudo.nombre}
              </Text>
            ) : null}
          </View>
        </View>

        {envio.estado === 'en_transito' || envio.estado === 'entregado' ? (
          <View style={styles.mapaContainer}>
            <RouteMap
              origen={{ ...envio.origen, label: envio.comercioNombre }}
              destino={envio.destinoPudo}
            />
          </View>
        ) : null}

        <PudoInfoCard punto={envio.destinoPudo} distanciaKm={envio.distanciaKm} />

        <CodigoEntregaCard
          qrValue={envio.qrEntrega}
          pin={envio.pin}
          comercioNombre={envio.comercioNombre}
          repartidorNombre={envio.repartidorNombre}
        />

        <Text style={styles.actualizadoTexto}>Actualizado {tiempoRelativo(envio.actualizadoEn)}</Text>

        <View style={styles.accionesRow}>
          <View style={{ flex: 1 }}>
            <PrimaryButton
              label="Reportar un problema"
              variant="secondary"
              onPress={() => setModalProblema(true)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton
              label={yaCalifico ? 'Calificación enviada' : 'Calificar entrega'}
              onPress={() => setModalCalificar(true)}
              disabled={yaCalifico}
            />
          </View>
        </View>
      </ScrollView>

      <RatingModal
        visible={modalCalificar}
        repartidorNombre={envio.repartidorNombre}
        onClose={() => setModalCalificar(false)}
        onSubmit={handleCalificar}
        loading={enviando}
      />

      <ReportarProblemaModal
        visible={modalProblema}
        onClose={() => setModalProblema(false)}
        onSubmit={handleReportar}
        loading={enviando}
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
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  bannerInfo: {
    backgroundColor: colors.primarySoft,
  },
  bannerExito: {
    backgroundColor: colors.successSoft,
  },
  bannerTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  bannerEta: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  mapaContainer: {
    height: 220,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  actualizadoTexto: {
    fontSize: 11,
    color: colors.textSubtle,
    textAlign: 'center',
  },
  accionesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
