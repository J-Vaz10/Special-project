import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, radius, spacing } from '@/theme/colors';

interface PinBackupModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => void;
  loading?: boolean;
}

/**
 * Validación por PIN de respaldo (RNF-09: Operación con Redes
 * Inestables) para cuando el repartidor no tiene señal para escanear
 * o el QR no puede leerse.
 */
export function PinBackupModal({ visible, onClose, onSubmit, loading }: PinBackupModalProps) {
  const [pin, setPin] = useState('');

  function handleClose() {
    setPin('');
    onClose();
  }

  function handleSubmit() {
    if (pin.length !== 4) return;
    onSubmit(pin);
  }

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.sheetWrapper}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <Ionicons name="keypad-outline" size={20} color={colors.primaryDark} />
              <Text style={styles.titulo}>PIN de respaldo</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cerrar"
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={18} color={colors.textMuted} />
              </Pressable>
            </View>

            <Text style={styles.descripcion}>
              ¿Sin datos o señal inestable? Ingresa el PIN de 4 dígitos que te compartió el comercio o el
              comprador para validar la entrega sin necesidad de escanear el QR.
            </Text>

            <TextInput
              value={pin}
              onChangeText={(texto) => setPin(texto.replace(/[^0-9]/g, '').slice(0, 4))}
              keyboardType="number-pad"
              maxLength={4}
              placeholder="0000"
              placeholderTextColor={colors.textSubtle}
              style={styles.input}
              accessibilityLabel="Campo para ingresar PIN de respaldo de 4 dígitos"
              autoFocus
            />

            <PrimaryButton
              label="Validar PIN"
              onPress={handleSubmit}
              disabled={pin.length !== 4}
              loading={loading}
            />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheetWrapper: {
    width: '100%',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  titulo: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descripcion: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 12,
    textAlign: 'center',
    color: colors.navy,
    backgroundColor: colors.surfaceMuted,
  },
});
