import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/theme/colors';

interface ScreenHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  bottom?: ReactNode;
  onBack?: () => void;
}

/** Cabecera oscura reutilizable, consistente con los mockups (fondo azul marino). */
export function ScreenHeader({ eyebrow, title, subtitle, right, bottom, onBack }: ScreenHeaderProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.row}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Regresar"
            onPress={onBack}
            style={styles.backButton}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={20} color={colors.white} />
          </Pressable>
        ) : null}
        <View style={styles.textBlock}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {right}
      </View>
      {bottom}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
  },
  eyebrow: {
    color: '#9FB3D1',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  title: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  subtitle: {
    color: '#B9C6DA',
    fontSize: 13,
    marginTop: 2,
  },
});
