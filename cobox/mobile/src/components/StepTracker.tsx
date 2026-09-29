import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/theme/colors';

export interface Paso {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface StepTrackerProps {
  pasos: Paso[];
  pasoActivo: number; // índice 0-based
}

/**
 * Rastreador horizontal de 3 pasos ("1. Recoger — En Tránsito — PUDO")
 * tal como aparece en el mockup de "Entrega Activa".
 */
export function StepTracker({ pasos, pasoActivo }: StepTrackerProps) {
  return (
    <View style={styles.row}>
      {pasos.map((paso, index) => {
        const completado = index < pasoActivo;
        const activo = index === pasoActivo;
        const estadoColor = completado || activo ? colors.primary : colors.border;

        return (
          <View style={styles.pasoContainer} key={paso.key}>
            <View style={styles.pasoIndicador}>
              <View
                style={[
                  styles.circulo,
                  { backgroundColor: activo || completado ? colors.primary : colors.surfaceMuted },
                ]}
              >
                <Ionicons
                  name={completado ? 'checkmark' : paso.icon}
                  size={14}
                  color={activo || completado ? colors.white : colors.textSubtle}
                />
              </View>
              {index < pasos.length - 1 ? (
                <View style={[styles.linea, { backgroundColor: estadoColor }]} />
              ) : null}
            </View>
            <Text
              style={[styles.label, (activo || completado) && styles.labelActivo]}
              numberOfLines={1}
            >
              {paso.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  pasoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  pasoIndicador: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  circulo: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linea: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  label: {
    marginTop: spacing.xs,
    fontSize: 11,
    color: colors.textSubtle,
    fontWeight: '600',
    textAlign: 'center',
  },
  labelActivo: {
    color: colors.navy,
  },
});
