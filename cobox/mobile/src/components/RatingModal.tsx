import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, radius, spacing } from '@/theme/colors';

interface RatingModalProps {
  visible: boolean;
  repartidorNombre?: string;
  onClose: () => void;
  onSubmit: (estrellas: 1 | 2 | 3 | 4 | 5, comentario?: string) => void;
  loading?: boolean;
}

/** RF-29 Retroalimentación: el comprador califica la entrega y al repartidor. */
export function RatingModal({ visible, repartidorNombre, onClose, onSubmit, loading }: RatingModalProps) {
  const [estrellas, setEstrellas] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [comentario, setComentario] = useState('');

  function handleClose() {
    setEstrellas(5);
    setComentario('');
    onClose();
  }

  function handleSubmit() {
    onSubmit(estrellas, comentario.trim() || undefined);
  }

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.sheetWrapper}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.titulo}>Calificar entrega</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cerrar sin calificar"
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={18} color={colors.textMuted} />
              </Pressable>
            </View>

            <Text style={styles.descripcion}>
              {repartidorNombre
                ? `¿Cómo estuvo la entrega de ${repartidorNombre}? Tu calificación es opcional.`
                : 'Tu calificación es opcional y ayuda a mejorar la red de repartidores COBOX.'}
            </Text>

            <View style={styles.estrellasRow}>
              {[1, 2, 3, 4, 5].map((valor) => (
                <Pressable
                  key={valor}
                  accessibilityRole="button"
                  accessibilityLabel={`Calificar con ${valor} estrellas`}
                  onPress={() => setEstrellas(valor as 1 | 2 | 3 | 4 | 5)}
                  hitSlop={6}
                >
                  <Ionicons
                    name={valor <= estrellas ? 'star' : 'star-outline'}
                    size={34}
                    color={colors.accentGold}
                  />
                </Pressable>
              ))}
            </View>

            <TextInput
              value={comentario}
              onChangeText={setComentario}
              placeholder="Comentario (opcional)"
              placeholderTextColor={colors.textSubtle}
              style={styles.input}
              multiline
              numberOfLines={3}
              accessibilityLabel="Comentario opcional sobre la entrega"
            />

            <View style={styles.acciones}>
              <PrimaryButton label="Ahora no" variant="ghost" onPress={handleClose} fullWidth={false} />
              <View style={{ flex: 1 }}>
                <PrimaryButton label="Enviar calificación" onPress={handleSubmit} loading={loading} />
              </View>
            </View>
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
  descripcion: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  estrellasRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
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
  acciones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
