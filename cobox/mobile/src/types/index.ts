/**
 * Tipos de dominio de COBOX, alineados a las entidades del ERS
 * (USUARIOS, NEGOCIO, ENVIO, PUNTO_ENCUENTRO, CALIFICACION) en la
 * porción que corresponde al módulo de Ángel: Bolsa de Envíos,
 * Mapa/Navegación, Escáner de doble validación y App Comprador.
 *
 * Estos tipos son el "contrato" que las Edge Functions de Supabase
 * (parte de Antonio) deberán satisfacer. Mientras tanto, `mock.ts`
 * y `shipmentsService.ts` los implementan en memoria.
 */

export type RolUsuario = 'comerciante' | 'repartidor' | 'comprador';

export type MedioTransporte = 'a_pie' | 'bicicleta' | 'scooter';

export type TamanoPaquete = 'pequeno' | 'mediano' | 'grande';

/**
 * Máquina de estados del envío (RNF-10: Integridad de la Información
 * de Envíos). El servidor central es quien valida las transiciones;
 * aquí solo se modela la secuencia permitida:
 * creado -> asignado -> en_transito -> entregado
 * (con "incidente" como rama lateral reportable en cualquier punto).
 */
export type EstadoEnvio =
  | 'creado'
  | 'asignado'
  | 'en_transito'
  | 'entregado'
  | 'incidente';

export interface Coordenadas {
  latitude: number;
  longitude: number;
}

export type TipoPuntoEncuentro = 'comercio_pudo' | 'estacion_mibici';

/** Corresponde a la entidad PUNTO_ENCUENTRO del ERS (RF-19, RF-20, RF-21). */
export interface PuntoEncuentro {
  id: string;
  nombre: string;
  tipo: TipoPuntoEncuentro;
  direccion: string;
  horario: string;
  referencias?: string;
  coordenadas: Coordenadas;
  custodiaGratuitaHoras?: number;
  verificado: boolean;
}

/** Corresponde a la entidad ENVIO del ERS. */
export interface Envio {
  /** Código único de rastreo, ej. CBX-240918-01 (RF-08, RF-22). */
  id: string;
  estado: EstadoEnvio;

  comercioNombre: string;
  origen: Coordenadas & { direccion: string };
  destinoPudo: PuntoEncuentro;

  tamano: TamanoPaquete;
  pesoKg: number;

  /** Pago ofrecido al repartidor en pesos mexicanos (RF-13). */
  pagoMXN: number;
  /** true cuando el pago está por encima del promedio ("VIP" en el mockup). */
  esPagoVip?: boolean;

  distanciaKm: number;
  transporteRecomendado: MedioTransporte[];

  compradorNombre?: string;
  compradorTelefono: string;

  repartidorId?: string;
  repartidorNombre?: string;

  /** Payload embebido en el QR que el comerciante muestra al repartidor. */
  qrRecoleccion: string;
  /** Payload embebido en el QR que el comprador muestra en el PUDO. */
  qrEntrega: string;
  /** PIN numérico de respaldo para RNF-09 (validación offline). */
  pin: string;

  creadoEn: string;
  actualizadoEn: string;
}

export type TipoValidacion = 'recoleccion' | 'entrega';
export type MetodoValidacion = 'qr' | 'pin';

/** Resultado de aplicar una validación QR/PIN sobre un envío (RF-23, RF-24, RF-25). */
export interface ResultadoValidacion {
  ok: boolean;
  envio?: Envio;
  mensaje: string;
}

export type FiltroBolsa = 'cercania' | 'pago' | 'vehiculo';

/** Corresponde a la entidad CALIFICACION del ERS (RF-29). */
export interface Calificacion {
  envioId: string;
  autor: 'comprador' | 'comerciante';
  estrellas: 1 | 2 | 3 | 4 | 5;
  comentario?: string;
  creadoEn: string;
}

export interface IncidenteReporte {
  envioId: string;
  reportadoPor: 'repartidor' | 'comprador';
  motivo: string;
  detalle?: string;
  creadoEn: string;
}
