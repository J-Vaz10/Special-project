import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme/colors';
import type { PuntoEncuentro } from '@/types';

interface PudoInfoCardProps {
  punto: PuntoEncuentro;
  distanciaKm?: number;
}

/** Ficha operativa de un punto de encuentro (RF-20): ubicación, horario y referencias. */
export function PudoInfoCard({ punto, distanciaKm }: PudoInfoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconoContainer}>
          <Ionicons
            name={punto.tipo === 'estacion_mibici' ? 'bicycle' : 'storefront-outline'}
            size={18}
            color={colors.primaryDark}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.nombre} numberOfLines={1}>
            {punto.nombre}
          </Text>
          <Text style={styles.direccion} numberOfLines={2}>
            {punto.direccion}
          </Text>
        </View>
        {punto.verificado ? (
          <Ionicons name="shield-checkmark" size={18} color={colors.success} />
        ) : null}
      </View>

      <View style={styles.metaRow}>
        <MetaItem icon="time-outline" texto={`Horario: ${punto.horario}`} />
        {typeof distanciaKm === 'number' ? (
          <MetaItem icon="navigate-outline" texto={`Distancia aprox: ${distanciaKm} km`} />
        ) : null}
        {punto.custodiaGratuitaHoras ? (
          <MetaItem
            icon="lock-closed-outline"
            texto={`Custodia gratuita hasta ${punto.custodiaGratuitaHoras} horas`}
          />
        ) : null}
        {punto.referencias ? <MetaItem icon="information-circle-outline" texto={punto.referencias} /> : null}
      </View>
    </View>
  );
}

function MetaItem({ icon, texto }: { icon: keyof typeof Ionicons.glyphMap; texto: string }) {
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={13} color={colors.textMuted} />
      <Text style={styles.metaTexto}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  iconoContainer: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nombre: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  direccion: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  metaRow: {
    gap: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  metaTexto: {
    fontSize: 12,
    color: colors.textMuted,
    flex: 1,
  },
});
