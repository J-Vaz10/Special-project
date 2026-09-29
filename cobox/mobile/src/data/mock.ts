import type { Envio, PuntoEncuentro } from '@/types';

/**
 * Datos de ejemplo para desarrollar y demostrar el módulo de Ángel sin
 * depender todavía de las Edge Functions / base de datos de Antonio.
 *
 * Coordenadas aproximadas del polígono urbano Centro de Guadalajara y
 * Zapopan (ver ERS §2.1.9.1). Todo lo que consume estos datos lo hace
 * a través de `services/shipmentsService.ts`, así que el día que el
 * backend real esté listo basta con reemplazar esa capa.
 */

export const puntosEncuentro: PuntoEncuentro[] = [
  {
    id: 'pudo-mibici-juarez',
    nombre: 'Estación MiBici Juárez',
    tipo: 'estacion_mibici',
    direccion: 'Av. Federalismo & Av. Juárez, Centro, Guadalajara',
    horario: '24 horas',
    referencias: 'Locker inteligente habilitado, junto a la ciclovía.',
    coordenadas: { latitude: 20.6786, longitude: -103.354 },
    custodiaGratuitaHoras: 48,
    verificado: true,
  },
  {
    id: 'pudo-papeleria-providencia',
    nombre: 'Papelería Providencia',
    tipo: 'comercio_pudo',
    direccion: 'Av. Providencia 1245, Col. Providencia, Guadalajara',
    horario: '09:00 - 20:00',
    referencias: 'Mostrador principal, preguntar por paquetería COBOX.',
    coordenadas: { latitude: 20.6975, longitude: -103.3875 },
    custodiaGratuitaHoras: 24,
    verificado: true,
  },
  {
    id: 'pudo-mibici-chapultepec',
    nombre: 'Estación MiBici Chapultepec',
    tipo: 'estacion_mibici',
    direccion: 'Av. Chapultepec & Av. México, Col. Americana, Guadalajara',
    horario: '24 horas',
    referencias: 'Frente al camellón, casilleros numerados del 1 al 12.',
    coordenadas: { latitude: 20.6721, longitude: -103.3705 },
    custodiaGratuitaHoras: 48,
    verificado: true,
  },
  {
    id: 'pudo-abarrotes-minerva',
    nombre: 'Abarrotes La Fuente (Minerva)',
    tipo: 'comercio_pudo',
    direccion: 'Av. Vallarta 2340, Col. Arcos Vallarta, Guadalajara',
    horario: '08:00 - 22:00',
    referencias: 'Local esquina, entrada por Av. Vallarta.',
    coordenadas: { latitude: 20.6748, longitude: -103.3919 },
    custodiaGratuitaHoras: 24,
    verificado: true,
  },
  {
    id: 'pudo-zapopan-centro',
    nombre: 'Farmacia San Pedro (Zapopan Centro)',
    tipo: 'comercio_pudo',
    direccion: 'Av. Hidalgo 88, Centro, Zapopan',
    horario: '07:00 - 23:00',
    referencias: 'A dos cuadras de la Basílica de Zapopan.',
    coordenadas: { latitude: 20.7236, longitude: -103.3848 },
    custodiaGratuitaHoras: 24,
    verificado: true,
  },
  {
    id: 'pudo-mibici-expiatorio',
    nombre: 'Estación MiBici Expiatorio',
    tipo: 'estacion_mibici',
    direccion: 'Av. Enrique Díaz de León, Col. Americana, Guadalajara',
    horario: '24 horas',
    referencias: 'Junto al Templo Expiatorio.',
    coordenadas: { latitude: 20.6802, longitude: -103.3672 },
    custodiaGratuitaHoras: 48,
    verificado: false,
  },
];

const comercioCafeCentro = {
  nombre: 'Café & Accesorios Centro',
  direccion: 'Portal Madero 120, Centro, Guadalajara',
  coordenadas: { latitude: 20.6767, longitude: -103.3475 },
};

/**
 * Envío ya aceptado y en curso: sirve para demostrar el flujo completo
 * (Paso 2 Mapa, Paso 3 Escáner del repartidor, Paso 4 Seguimiento del
 * comprador) sobre un mismo caso, tal como aparece en los mockups
 * (CBX-240918-01, PIN 8974, repartidor Carlos Gómez).
 */
export const envioActivoDemo: Envio = {
  id: 'CBX-240927-01',
  estado: 'en_transito',
  comercioNombre: comercioCafeCentro.nombre,
  origen: {
    ...comercioCafeCentro.coordenadas,
    direccion: comercioCafeCentro.direccion,
  },
  destinoPudo: puntosEncuentro[0], // Estación MiBici Juárez
  tamano: 'mediano',
  pesoKg: 2,
  pagoMXN: 35,
  esPagoVip: false,
  distanciaKm: 3.2,
  transporteRecomendado: ['bicicleta', 'a_pie'],
  compradorNombre: 'Comprador Final',
  compradorTelefono: '33 9876 5432',
  repartidorId: 'demo-repartidor',
  repartidorNombre: 'Carlos Gómez',
  qrRecoleccion: 'COBOX|CBX-240927-01|RECOLECCION|8974',
  qrEntrega: 'COBOX|CBX-240927-01|ENTREGA|8974',
  pin: '8974',
  creadoEn: '2026-09-27T11:32:00-06:00',
  actualizadoEn: '2026-09-27T12:10:00-06:00',
};

/** Solicitudes disponibles en la Bolsa de Envíos (RF-11 a RF-14), sin asignar. */
export const enviosBolsaDemo: Envio[] = [
  {
    id: 'CBX-240927-02',
    estado: 'creado',
    comercioNombre: 'Café & Accesorios Centro',
    origen: {
      ...comercioCafeCentro.coordenadas,
      direccion: comercioCafeCentro.direccion,
    },
    destinoPudo: puntosEncuentro[0],
    tamano: 'mediano',
    pesoKg: 2,
    pagoMXN: 50,
    esPagoVip: true,
    distanciaKm: 1.2,
    transporteRecomendado: ['bicicleta'],
    compradorTelefono: '33 1122 3344',
    qrRecoleccion: 'COBOX|CBX-240927-02|RECOLECCION|4410',
    qrEntrega: 'COBOX|CBX-240927-02|ENTREGA|4410',
    pin: '4410',
    creadoEn: '2026-09-27T13:05:00-06:00',
    actualizadoEn: '2026-09-27T13:05:00-06:00',
  },
  {
    id: 'CBX-240927-03',
    estado: 'creado',
    comercioNombre: 'Papelería Providencia',
    origen: {
      latitude: 20.6975,
      longitude: -103.3875,
      direccion: 'Av. Providencia 1245, Col. Providencia, Guadalajara',
    },
    destinoPudo: puntosEncuentro[2],
    tamano: 'pequeno',
    pesoKg: 0.5,
    pagoMXN: 40,
    distanciaKm: 2.6,
    transporteRecomendado: ['a_pie', 'scooter'],
    compradorTelefono: '33 5544 7788',
    qrRecoleccion: 'COBOX|CBX-240927-03|RECOLECCION|1187',
    qrEntrega: 'COBOX|CBX-240927-03|ENTREGA|1187',
    pin: '1187',
    creadoEn: '2026-09-27T12:48:00-06:00',
    actualizadoEn: '2026-09-27T12:48:00-06:00',
  },
  {
    id: 'CBX-240927-04',
    estado: 'creado',
    comercioNombre: 'Abarrotes La Fuente',
    origen: {
      latitude: 20.6748,
      longitude: -103.3919,
      direccion: 'Av. Vallarta 2340, Col. Arcos Vallarta, Guadalajara',
    },
    destinoPudo: puntosEncuentro[4],
    tamano: 'grande',
    pesoKg: 4.5,
    pagoMXN: 65,
    distanciaKm: 4.8,
    transporteRecomendado: ['scooter'],
    compradorTelefono: '33 2233 9900',
    qrRecoleccion: 'COBOX|CBX-240927-04|RECOLECCION|3392',
    qrEntrega: 'COBOX|CBX-240927-04|ENTREGA|3392',
    pin: '3392',
    creadoEn: '2026-09-27T10:15:00-06:00',
    actualizadoEn: '2026-09-27T10:15:00-06:00',
  },
  {
    id: 'CBX-240927-05',
    estado: 'creado',
    comercioNombre: 'Farmacia San Pedro',
    origen: {
      latitude: 20.7236,
      longitude: -103.3848,
      direccion: 'Av. Hidalgo 88, Centro, Zapopan',
    },
    destinoPudo: puntosEncuentro[5],
    tamano: 'pequeno',
    pesoKg: 1,
    pagoMXN: 45,
    distanciaKm: 2.1,
    transporteRecomendado: ['bicicleta', 'a_pie'],
    compradorTelefono: '33 8811 2200',
    qrRecoleccion: 'COBOX|CBX-240927-05|RECOLECCION|7765',
    qrEntrega: 'COBOX|CBX-240927-05|ENTREGA|7765',
    pin: '7765',
    creadoEn: '2026-09-27T09:40:00-06:00',
    actualizadoEn: '2026-09-27T09:40:00-06:00',
  },
];
