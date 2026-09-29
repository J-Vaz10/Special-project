import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { ScreenHeader } from '@/components/ScreenHeader';
import { EstadoBadge } from '@/components/Badge';
import { shipmentsService } from '@/services/shipmentsService';
import { colors, radius, spacing } from '@/theme/colors';
import { formatoMXN, tiempoRelativo } from '@/utils/format';
import type { Envio } from '@/types';

// TODO(Jorge/Antonio): reemplazar por el usuario autenticado real (Supabase Auth).
const COMPRADOR_DEMO_TELEFONO = '33 9876 5432';

/** Listado de pedidos del comprador (RF-09 / RF-27), punto de entrada al rastreo. */
export default function MisPedidosScreen() {
  const [pedidos, setPedidos] = useState<Envio[]>([]);
  const [cargando, setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let activo = true;
      setCargando(true);
      shipmentsService
        .getPedidosComprador(COMPRADOR_DEMO_TELEFONO)
        .then((resultado) => activo && setPedidos(resultado))
        .finally(() => activo && setCargando(false));
      return () => {
        activo = false;
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <ScreenHeader eyebrow="COBOX Comprador" title="Mis pedidos" onBack={() => router.back()} />

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/comprador/seguimiento/${item.id}`)}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardId}>{item.id}</Text>
              <EstadoBadge estado={item.estado} />
            </View>
            <Text style={styles.cardDestino} numberOfLines={1}>
              Destino: {item.destinoPudo.nombre}
            </Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardActualizado}>Actualizado {tiempoRelativo(item.actualizadoEn)}</Text>
              <Text style={styles.cardPago}>{formatoMXN(item.pagoMXN)}</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          !cargando ? (
            <View style={styles.vacio}>
              <Ionicons name="bag-handle-outline" size={28} color={colors.textSubtle} />
              <Text style={styles.vacioTexto}>Todavía no tienes pedidos en camino.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  lista: {
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardId: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.navy,
  },
  cardDestino: {
    fontSize: 13,
    color: colors.textMuted,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  cardActualizado: {
    fontSize: 11,
    color: colors.textSubtle,
  },
  cardPago: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.success,
  },
  vacio: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  vacioTexto: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
