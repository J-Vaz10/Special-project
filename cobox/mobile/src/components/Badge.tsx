import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/theme/colors';
import type { EstadoEnvio } from '@/types';

type Tono = 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'gold';

interface BadgeProps {
  label: string;
  tono?: Tono;
}

export function Badge({ label, tono = 'neutral' }: BadgeProps) {
  const paleta = paletas[tono];
  return (
    <View style={[styles.container, { backgroundColor: paleta.bg }]}>
      <Text style={[styles.label, { color: paleta.fg }]}>{label}</Text>
    </View>
  );
}

const ESTADO_INFO: Record<EstadoEnvio, { label: string; tono: Tono }> = {
  creado: { label: 'Disponible', tono: 'neutral' },
  asignado: { label: 'Asignado', tono: 'warning' },
  en_transito: { label: 'En tránsito', tono: 'primary' },
  entregado: { label: 'Entregado', tono: 'success' },
  incidente: { label: 'Incidente', tono: 'danger' },
};

export function EstadoBadge({ estado }: { estado: EstadoEnvio }) {
  const info = ESTADO_INFO[estado];
  return <Badge label={info.label} tono={info.tono} />;
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
});

const paletas: Record<Tono, { bg: string; fg: string }> = {
  primary: { bg: colors.primarySoft, fg: colors.primaryDark },
  success: { bg: colors.successSoft, fg: colors.success },
  warning: { bg: colors.warningSoft, fg: colors.warning },
  danger: { bg: colors.dangerSoft, fg: colors.danger },
  neutral: { bg: colors.surfaceMuted, fg: colors.textMuted },
  gold: { bg: '#FBF0DA', fg: colors.accentGold },
};
