import { useRef } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, radius, spacing } from '@/theme/colors';

interface QRScannerModalProps {
  visible: boolean;
  titulo: string;
  instrucciones: string;
  onClose: () => void;
  onScanned: (data: string) => void;
  /** Código a inyectar con el botón "Simular escaneo" (solo en __DEV__, para probar sin cámara física). */
  testCode?: string;
}

/**
 * Escáner de QR de doble validación (RF-23 Escaneo en Comercio y
 * RF-24 Escaneo al Comprador) usando `expo-camera`.
 */
export function QRScannerModal({
  visible,
  titulo,
  instrucciones,
  onClose,
  onScanned,
  testCode,
}: QRScannerModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const yaEscaneado = useRef(false);

  function handleBarcodeScanned({ data }: { data: string }) {
    if (yaEscaneado.current) return;
    yaEscaneado.current = true;
    onScanned(data);
  }

  function handleClose() {
    yaEscaneado.current = false;
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.container}>
        {permission?.granted ? (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={handleBarcodeScanned}
          />
        ) : (
          <View style={styles.permisoContainer}>
            <Ionicons name="camera-outline" size={40} color={colors.white} />
            <Text style={styles.permisoTexto}>
              COBOX necesita acceso a tu cámara para escanear el código QR del paquete.
            </Text>
            <PrimaryButton label="Permitir cámara" onPress={requestPermission} />
          </View>
        )}

        <SafeAreaView style={styles.overlay} pointerEvents="box-none">
          <View style={styles.topBar}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar escáner"
              onPress={handleClose}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={22} color={colors.white} />
            </Pressable>
          </View>

          <View style={styles.textoContainer}>
            <Text style={styles.titulo}>{titulo}</Text>
            <Text style={styles.instrucciones}>{instrucciones}</Text>
          </View>

          {permission?.granted ? <View style={styles.marco} pointerEvents="none" /> : null}

          {__DEV__ && testCode ? (
            <View style={styles.devBar}>
              <PrimaryButton
                label="Simular escaneo (dev)"
                variant="secondary"
                onPress={() => handleBarcodeScanned({ data: testCode })}
              />
            </View>
          ) : null}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const MARCO_SIZE = 240;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoContainer: {
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  titulo: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  instrucciones: {
    color: '#D8E0EC',
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  marco: {
    alignSelf: 'center',
    width: MARCO_SIZE,
    height: MARCO_SIZE,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: spacing.xxl * 2,
  },
  permisoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  permisoTexto: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 14,
  },
  devBar: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});
