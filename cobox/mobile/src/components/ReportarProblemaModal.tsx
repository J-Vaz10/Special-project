import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, radius, spacing } from '@/theme/colors';

interface ReportarProblemaModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (motivo: string, detalle?: string) => void;
  loading?: boolean;
}

const MOTIVOS = ['Paquete dañado', 'No localizo al repartidor', 'Retraso prolongado', 'Otro'];

/** Reporte de incidente desde la app comprador (caso de uso "Reportar incidente"). */
export function ReportarProblemaModal({ visible, onClose, onSubmit, loading }: ReportarProblemaModalProps) {
  const [motivo, setMotivo] = useState<string | null>(null);
  const [detalle, setDetalle] = useState('');

  function handleClose() {
    setMotivo(null);
    setDetalle('');
    onClose();
  }

  function handleSubmit() {
    if (!motivo) return;
    onSubmit(motivo, detalle.trim() || undefined);
  }

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.sheetWrapper}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.titulo}>Reportar un problema</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cerrar"
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={18} color={colors.textMuted} />
              </Pressable>
            </View>

            <View style={styles.motivosRow}>
              {MOTIVOS.map((opcion) => {
                const seleccionado = opcion === motivo;
                return (
                  <Pressable
                    key={opcion}
                    onPress={() => setMotivo(opcion)}
                    style={[styles.motivoChip, seleccionado && styles.motivoChipActivo]}
                  >
                    <Text style={[styles.motivoTexto, seleccionado && styles.motivoTextoActivo]}>{opcion}</Text>
                  </Pressable>
                );
              })}
            </View>

            <TextInput
              value={detalle}
              onChangeText={setDetalle}
              placeholder="Cuéntanos más detalles (opcional)"
              placeholderTextColor={colors.textSubtle}
              style={styles.input}
              multiline
              numberOfLines={3}
            />

            <PrimaryButton
              label="Enviar reporte"
              variant="danger"
              onPress={handleSubmit}
              disabled={!motivo}
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
    justifyContent: 'space-between',
  },
  titulo: {
    fontSize: 17,
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
  motivosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  motivoChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  motivoChipActivo: {
    backgroundColor: colors.dangerSoft,
  },
  motivoTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  motivoTextoActivo: {
    color: colors.danger,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.surfaceMuted,
    minHeight: 72,
    textAlignVertical: 'top',
  },
});
