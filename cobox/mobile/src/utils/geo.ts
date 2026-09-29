import type { Coordenadas } from '@/types';

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Distancia aproximada en línea recta entre dos coordenadas (fórmula de Haversine). */
export function distanciaKm(a: Coordenadas, b: Coordenadas): number {
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return EARTH_RADIUS_KM * c;
}

/**
 * Genera puntos intermedios entre origen y destino para simular un
 * trazado de ruta mientras no está conectada la Directions API de
 * Google Maps (parte de Antonio). Se usa solo para dibujar la
 * Polyline en el mapa de forma más realista que una línea recta.
 */
export function construirRutaSimulada(
  origen: Coordenadas,
  destino: Coordenadas,
  segmentos = 6,
): Coordenadas[] {
  const puntos: Coordenadas[] = [];
  for (let i = 0; i <= segmentos; i++) {
    const t = i / segmentos;
    // Ligero desvío ondulado para que no sea una línea perfectamente recta.
    const jitter = Math.sin(t * Math.PI) * 0.0009 * (i % 2 === 0 ? 1 : -1);
    puntos.push({
      latitude: origen.latitude + (destino.latitude - origen.latitude) * t + jitter,
      longitude: origen.longitude + (destino.longitude - origen.longitude) * t + jitter,
    });
  }
  return puntos;
}

export function regionParaPuntos(puntos: Coordenadas[], paddingFactor = 1.6) {
  const lats = puntos.map((p) => p.latitude);
  const lons = puntos.map((p) => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);

  const latitude = (minLat + maxLat) / 2;
  const longitude = (minLon + maxLon) / 2;
  const latitudeDelta = Math.max((maxLat - minLat) * paddingFactor, 0.015);
  const longitudeDelta = Math.max((maxLon - minLon) * paddingFactor, 0.015);

  return { latitude, longitude, latitudeDelta, longitudeDelta };
}
