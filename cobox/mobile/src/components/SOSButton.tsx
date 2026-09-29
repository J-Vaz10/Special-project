import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme/colors';

interface SOSButtonProps {
  envioId: string;
}

/**
 * Botón de emergencia visible durante una entrega activa.
 *
 * La UI y la confirmación quedan resueltas aquí; el envío real de la
 * alerta (SMS/WhatsApp vía Twilio) lo dispara el servidor central, que
 * es responsabilidad de Antonio — este botón es el punto de enganche.
 */
export function SOSButton({ envioId }: SOSButtonProps) {
  function handlePress() {
    Alert.alert(
      'Alerta SOS',
      `Se notificará a soporte COBOX sobre un incidente en el envío ${envioId}. ¿Confirmas el aviso de emergencia?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar alerta',
          style: 'destructive',
          onPress: () =>
            Alert.alert('Alerta enviada', 'Soporte COBOX fue notificado y se pondrá en contacto contigo.'),
        },
      ],
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Enviar alerta de emergencia SOS"
      onPress={handlePress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Ionicons name="alert-circle" size={16} color={colors.white} />
      <Text style={styles.label}>SOS</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
