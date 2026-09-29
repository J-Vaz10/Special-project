import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme/colors';
import type { FiltroBolsa } from '@/types';

interface FilterBarProps {
  activo: FiltroBolsa;
  onCambiar: (filtro: FiltroBolsa) => void;
}

const OPCIONES: { valor: FiltroBolsa; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { valor: 'cercania', label: 'Más cerca', icon: 'navigate-outline' },
  { valor: 'pago', label: 'Mayor pago', icon: 'cash-outline' },
  { valor: 'vehiculo', label: 'Bici / Scooter', icon: 'bicycle-outline' },
];

/** Filtros rápidos de la Bolsa de Envíos (RF-12, RF-13, RF-14). */
export function FilterBar({ activo, onCambiar }: FilterBarProps) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {OPCIONES.map((opcion) => {
        const seleccionado = opcion.valor === activo;
        return (
          <Pressable
            key={opcion.valor}
            accessibilityRole="button"
            accessibilityState={{ selected: seleccionado }}
            onPress={() => onCambiar(opcion.valor)}
            style={[styles.chip, seleccionado && styles.chipActivo]}
          >
            <Ionicons
              name={opcion.icon}
              size={14}
              color={seleccionado ? colors.white : colors.textMuted}
            />
            <Text style={[styles.label, seleccionado && styles.labelActivo]}>{opcion.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  chipActivo: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  labelActivo: {
    color: colors.white,
  },
});
