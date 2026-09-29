import { enviosBolsaDemo, envioActivoDemo, puntosEncuentro } from '@/data/mock';
import { distanciaKm } from '@/utils/geo';
import type {
  Calificacion,
  Coordenadas,
  Envio,
  FiltroBolsa,
  IncidenteReporte,
  MetodoValidacion,
  PuntoEncuentro,
  ResultadoValidacion,
  TipoValidacion,
} from '@/types';

/**
 * Capa de servicios de Ángel para envíos, puntos PUDO, validaciones y
 * calificaciones.
 *
 * Hoy opera sobre un "store" en memoria sembrado con datos mock, para
 * poder construir y demostrar la UI sin depender de que el backend de
 * Antonio (Supabase Edge Functions) esté desplegado.
 *
 * Cuando esas funciones existan, esta es la ÚNICA capa que debe
 * cambiar: las firmas (nombres, parámetros, tipos de retorno) ya están
 * pensadas para mapear 1:1 con los endpoints descritos en la división
 * de trabajo ("función que genera QR/PIN", "endpoint para validar
 * QR/PIN"). Ninguna pantalla debería importar `data/mock` directamente.
 */

// Simula la latencia de una llamada real a Supabase / Google Maps.
function delay<T>(valor: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(valor), ms));
}

let enviosDB: Envio[] = [envioActivoDemo, ...enviosBolsaDemo];

function clonar<T>(valor: T): T {
  return JSON.parse(JSON.stringify(valor));
}

export const shipmentsService = {
  /**
   * RF-11 Visualización de Ofertas / RF-12 Filtrado Geográfico /
   * RF-13 Filtrado por Tarifa / RF-14 Vehículo Recomendado.
   */
  async getBolsa(
    filtro: FiltroBolsa = 'cercania',
    ubicacionRepartidor: Coordenadas = { latitude: 20.6919, longitude: -103.3646 }, // Centro GDL/Zapopan
  ): Promise<Envio[]> {
    const disponibles = enviosDB.filter((e) => e.estado === 'creado');

    const conDistancia = disponibles.map((envio) => ({
      envio,
      distancia: distanciaKm(ubicacionRepartidor, envio.origen),
    }));

    let ordenados = conDistancia;
    if (filtro === 'pago') {
      ordenados = [...conDistancia].sort((a, b) => b.envio.pagoMXN - a.envio.pagoMXN);
    } else if (filtro === 'vehiculo') {
      ordenados = [...conDistancia].sort((a, b) => {
        const rank = (e: Envio) =>
          e.transporteRecomendado.includes('bicicleta') || e.transporteRecomendado.includes('scooter') ? 0 : 1;
        return rank(a.envio) - rank(b.envio);
      });
    } else {
      ordenados = [...conDistancia].sort((a, b) => a.distancia - b.distancia);
    }

    const resultado = ordenados.map(({ envio, distancia }) => ({
      ...clonar(envio),
      distanciaKm: Math.round(distancia * 10) / 10,
    }));

    return delay(resultado);
  },

  async getEnvio(id: string): Promise<Envio | undefined> {
    const envio = enviosDB.find((e) => e.id === id);
    return delay(envio ? clonar(envio) : undefined);
  },

  async getPuntosEncuentro(): Promise<PuntoEncuentro[]> {
    return delay(clonar(puntosEncuentro), 150);
  },

  /** RF-09 Listado de Envíos / RF-27 Detalle del Pedido, vistos por el comprador. */
  async getPedidosComprador(telefonoComprador: string): Promise<Envio[]> {
    const pedidos = enviosDB
      .filter((e) => e.compradorTelefono === telefonoComprador)
      .sort((a, b) => new Date(b.actualizadoEn).getTime() - new Date(a.actualizadoEn).getTime());
    return delay(clonar(pedidos));
  },

  /** RF-15 Toma de Pedidos: el repartidor acepta un envío disponible. */
  async aceptarEnvio(
    id: string,
    repartidor: { id: string; nombre: string },
  ): Promise<Envio> {
    const idx = enviosDB.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('El envío ya no está disponible.');
    if (enviosDB[idx].estado !== 'creado') {
      throw new Error('Este envío ya fue tomado por otro repartidor.');
    }

    enviosDB[idx] = {
      ...enviosDB[idx],
      estado: 'asignado',
      repartidorId: repartidor.id,
      repartidorNombre: repartidor.nombre,
      actualizadoEn: new Date().toISOString(),
    };

    return delay(clonar(enviosDB[idx]));
  },

  /**
   * RF-23 Escaneo en Comercio / RF-24 Escaneo al Comprador / RF-25
   * Transición de Estados. Acepta tanto el valor leído por cámara
   * (QR) como el PIN de respaldo tecleado a mano (RNF-09).
   */
  async validarCodigo(
    envioId: string,
    tipo: TipoValidacion,
    metodo: MetodoValidacion,
    valor: string,
  ): Promise<ResultadoValidacion> {
    const idx = enviosDB.findIndex((e) => e.id === envioId);
    if (idx === -1) {
      return delay({ ok: false, mensaje: 'No se encontró el envío indicado.' });
    }

    const envio = enviosDB[idx];
    const valorNormalizado = valor.trim().toUpperCase();

    const esValido =
      metodo === 'pin'
        ? valorNormalizado === envio.pin
        : valorNormalizado === (tipo === 'recoleccion' ? envio.qrRecoleccion : envio.qrEntrega).toUpperCase();

    if (!esValido) {
      return delay({
        ok: false,
        mensaje: metodo === 'pin' ? 'El PIN no coincide con este envío.' : 'El código QR no corresponde a este envío.',
      });
    }

    if (tipo === 'recoleccion' && envio.estado !== 'asignado') {
      return delay({ ok: false, mensaje: 'Este envío no está listo para recolección.' });
    }
    if (tipo === 'entrega' && envio.estado !== 'en_transito') {
      return delay({ ok: false, mensaje: 'Aún falta confirmar la recolección en el comercio.' });
    }

    const nuevoEstado = tipo === 'recoleccion' ? 'en_transito' : 'entregado';
    enviosDB[idx] = { ...envio, estado: nuevoEstado, actualizadoEn: new Date().toISOString() };

    return delay({
      ok: true,
      envio: clonar(enviosDB[idx]),
      mensaje:
        tipo === 'recoleccion'
          ? 'Paquete recolectado. Ahora dirígete al punto PUDO de entrega.'
          : '¡Entrega confirmada! El comprador ya puede retirar su paquete.',
    });
  },

  /** RF-29 Retroalimentación: comprador/comerciante califican al repartidor. */
  async calificarEntrega(
    input: Omit<Calificacion, 'creadoEn'>,
  ): Promise<Calificacion> {
    const calificacion: Calificacion = { ...input, creadoEn: new Date().toISOString() };
    // TODO(Antonio): persistir en la tabla CALIFICACION vía Supabase.
    return delay(calificacion);
  },

  async reportarIncidente(
    input: Omit<IncidenteReporte, 'creadoEn'>,
  ): Promise<IncidenteReporte> {
    const idx = enviosDB.findIndex((e) => e.id === input.envioId);
    if (idx !== -1) {
      enviosDB[idx] = { ...enviosDB[idx], estado: 'incidente', actualizadoEn: new Date().toISOString() };
    }
    const reporte: IncidenteReporte = { ...input, creadoEn: new Date().toISOString() };
    return delay(reporte);
  },

  /** Solo para pruebas/demo: restaura el store en memoria a su estado inicial. */
  _reset(): void {
    enviosDB = [clonar(envioActivoDemo), ...enviosBolsaDemo.map(clonar)];
  },
};
