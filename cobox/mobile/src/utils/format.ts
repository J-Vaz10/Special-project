export function formatoMXN(valor: number): string {
  return `$${valor.toFixed(2)} MXN`;
}

export function formatoPeso(kg: number): string {
  return kg < 1 ? `${Math.round(kg * 1000)} g` : `${kg} kg`;
}

const ETIQUETA_TAMANO: Record<string, string> = {
  pequeno: 'Pequeño (Sobre)',
  mediano: 'Mediano (Caja zapatos)',
  grande: 'Grande (Caja mudanza)',
};

export function etiquetaTamano(tamano: string): string {
  return ETIQUETA_TAMANO[tamano] ?? tamano;
}

const ETIQUETA_TRANSPORTE: Record<string, string> = {
  a_pie: 'A pie',
  bicicleta: 'Bicicleta',
  scooter: 'Monopatín',
};

export function etiquetaTransporte(medio: string): string {
  return ETIQUETA_TRANSPORTE[medio] ?? medio;
}

export function tiempoRelativo(fechaIso: string): string {
  const ahora = Date.now();
  const fecha = new Date(fechaIso).getTime();
  const diffMin = Math.round((ahora - fecha) / 60000);

  if (diffMin <= 0) return 'justo ahora';
  if (diffMin < 60) return `hace ${diffMin} min`;

  const diffHoras = Math.round(diffMin / 60);
  if (diffHoras < 24) return `hace ${diffHoras} h`;

  const diffDias = Math.round(diffHoras / 24);
  return `hace ${diffDias} d`;
}

/** Estima minutos de llegada a partir de la distancia y un medio de transporte. */
export function estimarMinutos(distanciaKm: number, medio: 'a_pie' | 'bicicleta' | 'scooter'): number {
  const velocidadKmH = medio === 'a_pie' ? 4.5 : medio === 'bicicleta' ? 15 : 18;
  const minutos = (distanciaKm / velocidadKmH) * 60;
  return Math.max(2, Math.round(minutos));
}
