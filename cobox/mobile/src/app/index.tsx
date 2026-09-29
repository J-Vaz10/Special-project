import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { colors, radius, spacing } from '@/theme/colors';

/**
 * Punto de entrada de esta demo aislada.
 *
 * En la app final, el selector de rol (Comerciante / Repartidor /
 * Comprador) y el login son responsabilidad de Jorge (Onboarding).
 * Esta pantalla es solo un acceso directo temporal para poder navegar
 * y probar el módulo de Ángel sin depender de esas pantallas todavía.
 */
export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>COBOX</Text>
        <Text style={styles.subtitulo}>Demo del módulo de Ángel</Text>
        <Text style={styles.parrafo}>
          Bolsa de envíos, mapa y navegación, escáner de doble validación, y app comprador con
          calificación. Elige qué vista quieres previsualizar.
        </Text>
      </View>

      <Link href="/repartidor" asChild>
        <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
          <View style={[styles.iconoContainer, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name="bicycle" size={22} color={colors.primaryDark} />
          </View>
          <View style={styles.cardTextos}>
            <Text style={styles.cardTitulo}>Repartidor colaborativo</Text>
            <Text style={styles.cardDescripcion}>
              Bolsa de envíos, ruta en el mapa y escáner de doble validación.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSubtle} />
        </Pressable>
      </Link>

      <Link href="/comprador" asChild>
        <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
          <View style={[styles.iconoContainer, { backgroundColor: '#FBF0DA' }]}>
            <Ionicons name="bag-handle" size={22} color={colors.accentGold} />
          </View>
          <View style={styles.cardTextos}>
            <Text style={styles.cardTitulo}>Comprador final</Text>
            <Text style={styles.cardDescripcion}>
              Rastreo en tiempo real, código QR/PIN de retiro y calificación de la entrega.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSubtle} />
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    gap: spacing.md,
  },
  header: {
    marginBottom: spacing.md,
  },
  logo: {
    fontSize: 30,
    fontWeight: '900',
    color: colors.navy,
    letterSpacing: 1,
  },
  subtitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
    marginTop: 4,
  },
  parrafo: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  cardPressed: {
    opacity: 0.85,
  },
  iconoContainer: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextos: {
    flex: 1,
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  cardDescripcion: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
