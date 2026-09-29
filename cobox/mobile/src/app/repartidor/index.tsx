import { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { ScreenHeader } from '@/components/ScreenHeader';
import { FilterBar } from '@/components/FilterBar';
import { ShipmentCard } from '@/components/ShipmentCard';
import { shipmentsService } from '@/services/shipmentsService';
import { colors, spacing } from '@/theme/colors';
import { formatoMXN } from '@/utils/format';
import type { Envio, FiltroBolsa } from '@/types';

// TODO(Jorge/Antonio): reemplazar por el usuario autenticado real (Supabase Auth).
const REPARTIDOR_DEMO = { id: 'demo-repartidor', nombre: 'Carlos Gómez' };

/** Paso 1: Bolsa de Envíos (RF-11, RF-12, RF-13, RF-14). */
export default function BolsaEnviosScreen() {
  const [filtro, setFiltro] = useState<FiltroBolsa>('cercania');
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [aceptandoId, setAceptandoId] = useState<string | null>(null);

  const cargarBolsa = useCallback(async (filtroActual: FiltroBolsa) => {
    const resultado = await shipmentsService.getBolsa(filtroActual);
    setEnvios(resultado);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let activo = true;
      setCargando(true);
      cargarBolsa(filtro).finally(() => {
        if (activo) setCargando(false);
      });
      return () => {
        activo = false;
      };
    }, [cargarBolsa, filtro]),
  );

  async function handleRefrescar() {
    setRefrescando(true);
    await cargarBolsa(filtro);
    setRefrescando(false);
  }

  async function handleAceptar(envio: Envio) {
    try {
      setAceptandoId(envio.id);
      const actualizado = await shipmentsService.aceptarEnvio(envio.id, REPARTIDOR_DEMO);
      router.push(`/repartidor/ruta/${actualizado.id}`);
    } catch (error) {
      Alert.alert('No se pudo aceptar', error instanceof Error ? error.message : 'Intenta de nuevo.');
      cargarBolsa(filtro);
    } finally {
      setAceptandoId(null);
    }
  }

  const mejorPagoVip = envios.reduce((max, e) => Math.max(max, e.pagoMXN), 0);

  return (
    <View style={styles.container}>
      <ScreenHeader
        eyebrow="Zapopan y Guadalajara · Activo"
        title={REPARTIDOR_DEMO.nombre}
        right={
          <View style={styles.syncBadge}>
            <Ionicons name="sync" size={12} color={colors.white} />
            <Text style={styles.syncTexto}>Sincronizado</Text>
          </View>
        }
        bottom={
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Envíos en la bolsa</Text>
              <Text style={styles.statValor}>{envios.length}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Mejor pago disponible</Text>
              <Text style={styles.statValor}>{formatoMXN(mejorPagoVip)}</Text>
            </View>
          </View>
        }
      />

      <View style={styles.listaHeader}>
        <Text style={styles.listaTitulo}>Ofertas disponibles</Text>
        <FilterBar activo={filtro} onCambiar={setFiltro} />
      </View>

      <FlatList
        data={envios}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listaContenido}
        refreshControl={
          <RefreshControl refreshing={refrescando} onRefresh={handleRefrescar} tintColor={colors.primary} />
        }
        renderItem={({ item }) => (
          <ShipmentCard envio={item} onAceptar={handleAceptar} aceptando={aceptandoId === item.id} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          !cargando ? (
            <View style={styles.vacio}>
              <Ionicons name="cube-outline" size={28} color={colors.textSubtle} />
              <Text style={styles.vacioTexto}>
                No hay envíos disponibles en este momento. Desliza hacia abajo para actualizar.
              </Text>
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
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
  },
  syncTexto: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: spacing.sm + 2,
  },
  statLabel: {
    color: '#B9C6DA',
    fontSize: 11,
  },
  statValor: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  listaHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  listaTitulo: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  listaContenido: {
    padding: spacing.lg,
    paddingTop: spacing.md,
    flexGrow: 1,
  },
  vacio: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  vacioTexto: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 13,
    paddingHorizontal: spacing.xl,
  },
});
