import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ScreenHeader';
import { RouteMap } from '@/components/RouteMap';
import { PudoInfoCard } from '@/components/PudoInfoCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { EstadoBadge } from '@/components/Badge';
import { shipmentsService } from '@/services/shipmentsService';
import { colors, radius, spacing } from '@/theme/colors';
import { estimarMinutos, etiquetaTransporte, formatoMXN } from '@/utils/format';
import type { Envio, PuntoEncuentro } from '@/types';

/** Paso 2: Mapa y Navegación (RF-16, RF-19, RF-20). */
export default function RutaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [envio, setEnvio] = useState<Envio | null>(null);
  const [puntos, setPuntos] = useState<PuntoEncuentro[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    if (!id) return;
    const [envioEncontrado, puntosEncontrados] = await Promise.all([
      shipmentsService.getEnvio(id),
      shipmentsService.getPuntosEncuentro(),
    ]);
    setEnvio(envioEncontrado ?? null);
    setPuntos(puntosEncontrados);
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

  const medioPrincipal = envio.transporteRecomendado[0] ?? 'bicicleta';
  const minutosEstimados = estimarMinutos(envio.distanciaKm, medioPrincipal);
  const puntosCercanos = puntos.filter((p) => p.id !== envio.destinoPudo.id);

  return (
    <View style={styles.container}>
      <ScreenHeader
        eyebrow={`Envío ${envio.id}`}
        title={`Ruta a ${envio.destinoPudo.nombre}`}
        onBack={() => router.back()}
        right={<EstadoBadge estado={envio.estado} />}
      />

      <View style={styles.mapaContainer}>
        <RouteMap
          origen={{ ...envio.origen, label: envio.comercioNombre }}
          destino={envio.destinoPudo}
          puntosCercanos={puntosCercanos}
        />
      </View>

      <View style={styles.panel}>
        <View style={styles.resumenRow}>
          <ResumenItem icon="navigate-outline" label="Distancia" valor={`${envio.distanciaKm} km`} />
          <ResumenItem icon="time-outline" label="Llegada estimada" valor={`${minutosEstimados} min`} />
          <ResumenItem icon="cash-outline" label="Pago" valor={formatoMXN(envio.pagoMXN)} />
        </View>

        <PudoInfoCard punto={envio.destinoPudo} distanciaKm={envio.distanciaKm} />

        <View style={styles.transporteRow}>
          <Ionicons name="alert-circle-outline" size={14} color={colors.textMuted} />
          <Text style={styles.transporteTexto}>
            Transporte recomendado: {envio.transporteRecomendado.map(etiquetaTransporte).join(' o ')}
          </Text>
        </View>

        <PrimaryButton
          label="Iniciar entrega y escanear código"
          onPress={() => router.push(`/repartidor/validar/${envio.id}`)}
        />
      </View>
    </View>
  );
}

function ResumenItem({
  icon,
  label,
  valor,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  valor: string;
}) {
  return (
    <View style={styles.resumenItem}>
      <Ionicons name={icon} size={16} color={colors.primaryDark} />
      <Text style={styles.resumenValor}>{valor}</Text>
      <Text style={styles.resumenLabel}>{label}</Text>
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
  mapaContainer: {
    flex: 1,
    margin: spacing.lg,
    marginBottom: 0,
  },
  panel: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    gap: spacing.md,
  },
  resumenRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  resumenItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  resumenValor: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  resumenLabel: {
    fontSize: 10,
    color: colors.textSubtle,
  },
  transporteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  transporteTexto: {
    fontSize: 12,
    color: colors.textMuted,
    flex: 1,
  },
});
