import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/Badge';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, radius, spacing } from '@/theme/colors';
import { etiquetaTamano, etiquetaTransporte, formatoMXN, formatoPeso } from '@/utils/format';
import type { Envio } from '@/types';

interface ShipmentCardProps {
  envio: Envio;
  onAceptar: (envio: Envio) => void;
  aceptando?: boolean;
}

const ICONO_TRANSPORTE: Record<string, keyof typeof Ionicons.glyphMap> = {
  a_pie: 'walk',
  bicicleta: 'bicycle',
  scooter: 'flash',
};

/** Tarjeta de la Bolsa de Envíos (RF-11 a RF-14): origen, destino, pago y peso. */
export function ShipmentCard({ envio, onAceptar, aceptando }: ShipmentCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.distanciaChip}>
          <Ionicons name="navigate" size={13} color={colors.primaryDark} />
          <Text style={styles.distanciaTexto}>A {envio.distanciaKm} km de ti</Text>
        </View>
        {envio.esPagoVip ? <Badge label="VIP" tono="gold" /> : null}
      </View>

      <View style={styles.rutaRow}>
        <View style={styles.rutaColumna}>
          <View style={styles.rutaLinea}>
            <View style={[styles.puntoRuta, { backgroundColor: colors.primary }]} />
            <View style={styles.lineaConectora} />
            <View style={[styles.puntoRuta, { backgroundColor: colors.accentGold }]} />
          </View>
          <View style={styles.rutaTextos}>
            <Text style={styles.rutaLabel} numberOfLines={1}>
              Origen: {envio.comercioNombre}
            </Text>
            <Text style={[styles.rutaLabel, { marginTop: spacing.md }]} numberOfLines={1}>
              Destino: {envio.destinoPudo.nombre}
            </Text>
          </View>
        </View>
        <Text style={styles.pago}>{formatoMXN(envio.pagoMXN)}</Text>
      </View>

      <View style={styles.detallesRow}>
        <View style={styles.detallePill}>
          <Ionicons name="cube-outline" size={13} color={colors.textMuted} />
          <Text style={styles.detalleTexto}>{etiquetaTamano(envio.tamano)}</Text>
        </View>
        <View style={styles.detallePill}>
          <Ionicons name="scale-outline" size={13} color={colors.textMuted} />
          <Text style={styles.detalleTexto}>{formatoPeso(envio.pesoKg)}</Text>
        </View>
        {envio.transporteRecomendado.map((medio) => (
          <View style={styles.detallePill} key={medio}>
            <Ionicons name={ICONO_TRANSPORTE[medio]} size={13} color={colors.textMuted} />
            <Text style={styles.detalleTexto}>{etiquetaTransporte(medio)}</Text>
          </View>
        ))}
      </View>

      <PrimaryButton label="Aceptar envío" onPress={() => onAceptar(envio)} loading={aceptando} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  distanciaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  distanciaTexto: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 12,
  },
  rutaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  rutaColumna: {
    flexDirection: 'row',
    flex: 1,
    gap: spacing.sm,
  },
  rutaLinea: {
    alignItems: 'center',
    paddingTop: 4,
  },
  puntoRuta: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  lineaConectora: {
    width: 2,
    flex: 1,
    minHeight: 22,
    backgroundColor: colors.border,
    marginVertical: 2,
  },
  rutaTextos: {
    flex: 1,
  },
  rutaLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  pago: {
    color: colors.success,
    fontSize: 18,
    fontWeight: '800',
  },
  detallesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  detallePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  detalleTexto: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
});
