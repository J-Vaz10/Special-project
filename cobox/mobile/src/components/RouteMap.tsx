import { useMemo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme/colors';
import { construirRutaSimulada, regionParaPuntos } from '@/utils/geo';
import type { Coordenadas, PuntoEncuentro } from '@/types';

interface RouteMapProps {
  origen: Coordenadas & { label: string };
  destino: PuntoEncuentro;
  /** Otros nodos PUDO / estaciones MiBici para mostrar como referencia (RF-19). */
  puntosCercanos?: PuntoEncuentro[];
  ubicacionRepartidor?: Coordenadas;
}

/**
 * Mapa con la ruta dibujada entre el comercio de origen y el punto PUDO
 * de destino, más los pines de puntos de encuentro seguros y
 * estaciones MiBici cercanas (RF-16, RF-19, RF-20).
 *
 * Usa `react-native-maps` sobre Google Maps; las API Keys reales las
 * configura Antonio en `app.json` (por ahora hay placeholders). La
 * Directions API todavía no está conectada, así que la Polyline se
 * genera con una ruta simulada (`construirRutaSimulada`).
 */
export function RouteMap({ origen, destino, puntosCercanos = [], ubicacionRepartidor }: RouteMapProps) {
  const ruta = useMemo(
    () => construirRutaSimulada(origen, destino.coordenadas),
    [origen, destino.coordenadas],
  );

  const region = useMemo(
    () =>
      regionParaPuntos([
        origen,
        destino.coordenadas,
        ...puntosCercanos.map((p) => p.coordenadas),
        ...(ubicacionRepartidor ? [ubicacionRepartidor] : []),
      ]),
    [origen, destino, puntosCercanos, ubicacionRepartidor],
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton={false}
        toolbarEnabled={false}
      >
        <Marker coordinate={origen} title="Origen" description={origen.label} pinColor={colors.primary}>
          <Callout>
            <Text style={styles.calloutTitle}>Origen</Text>
            <Text style={styles.calloutBody}>{origen.label}</Text>
          </Callout>
        </Marker>

        <Marker coordinate={destino.coordenadas} pinColor={colors.accentGold}>
          <Callout>
            <Text style={styles.calloutTitle}>{destino.nombre}</Text>
            <Text style={styles.calloutBody}>{destino.direccion}</Text>
            <Text style={styles.calloutMeta}>Horario: {destino.horario}</Text>
          </Callout>
        </Marker>

        {puntosCercanos.map((punto) => (
          <Marker
            key={punto.id}
            coordinate={punto.coordenadas}
            pinColor={punto.tipo === 'estacion_mibici' ? colors.primaryDark : colors.textSubtle}
          >
            <Callout>
              <Text style={styles.calloutTitle}>{punto.nombre}</Text>
              <Text style={styles.calloutBody}>{punto.direccion}</Text>
              <Text style={styles.calloutMeta}>Horario: {punto.horario}</Text>
            </Callout>
          </Marker>
        ))}

        {ubicacionRepartidor ? (
          <Marker coordinate={ubicacionRepartidor} pinColor={colors.danger} title="Tú" />
        ) : null}

        <Polyline coordinates={ruta} strokeColor={colors.primary} strokeWidth={4} lineDashPattern={[1]} />
      </MapView>

      <View style={styles.leyenda}>
        <LeyendaItem color={colors.primary} label="Origen" />
        <LeyendaItem color={colors.accentGold} label="PUDO destino" />
        <LeyendaItem color={colors.primaryDark} label="MiBici" />
      </View>
    </View>
  );
}

function LeyendaItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.leyendaItem}>
      <Ionicons name="ellipse" size={10} color={color} />
      <Text style={styles.leyendaTexto}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: radius.lg,
  },
  map: {
    flex: 1,
  },
  calloutTitle: {
    fontWeight: '700',
    fontSize: 13,
    color: colors.text,
    maxWidth: 200,
  },
  calloutBody: {
    fontSize: 12,
    color: colors.textMuted,
    maxWidth: 200,
  },
  calloutMeta: {
    fontSize: 11,
    color: colors.textSubtle,
    marginTop: 2,
  },
  leyenda: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  leyendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  leyendaTexto: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
  },
});
