import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { colors, radius, spacing } from '@/theme/colors';

interface CodigoEntregaCardProps {
  qrValue: string;
  pin: string;
  comercioNombre: string;
  repartidorNombre?: string;
}

/**
 * Código QR/PIN que el comprador muestra en el punto PUDO para
 * retirar su paquete (RF-18, RF-24). Formato "CBX - 8974" tal como
 * aparece en el mockup de seguimiento.
 */
export function CodigoEntregaCard({ qrValue, pin, comercioNombre, repartidorNombre }: CodigoEntregaCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>Muestra este código al recoger tu paquete</Text>

      <View style={styles.qrWrapper}>
        <QRCode value={qrValue} size={168} color={colors.navy} backgroundColor={colors.white} />
      </View>

      <Text style={styles.opcionTexto}>O indica el PIN de seguridad</Text>
      <Text style={styles.pin}>
        CBX <Text style={styles.pinGuion}>-</Text> {pin}
      </Text>

      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <View>
          <Text style={styles.footerLabel}>Comercio</Text>
          <Text style={styles.footerValor}>{comercioNombre}</Text>
        </View>
        {repartidorNombre ? (
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.footerLabel}>Repartidor</Text>
            <Text style={styles.footerValor}>{repartidorNombre}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  titulo: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  qrWrapper: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    marginVertical: spacing.sm,
  },
  opcionTexto: {
    fontSize: 12,
    color: colors.textMuted,
  },
  pin: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.navy,
    letterSpacing: 2,
  },
  pinGuion: {
    color: colors.primary,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  footerLabel: {
    fontSize: 11,
    color: colors.textSubtle,
  },
  footerValor: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
});
