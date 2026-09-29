# COBOX — Módulo de Ángel (Repartidor: Bolsa/Mapa/Escáner · App Comprador)

Este proyecto implementa **la parte 3 de la división de trabajo** del equipo COBOX:

1. **Maquetado de la Bolsa de Envíos** — lista de solicitudes disponibles con
   tarjetas (origen, destino, pago, peso) y filtros rápidos (Más cerca, Mayor
   pago, Bici/Scooter).
2. **Integración del Mapa y Navegación** — `react-native-maps` con la ruta
   dibujada en Guadalajara/Zapopan y los pines de puntos PUDO y estaciones
   MiBici.
3. **Módulo de Escáner y Doble Validación** — `expo-camera` para leer el QR
   del paquete en el comercio y en el PUDO, con botón de contingencia "PIN de
   respaldo" para operar sin señal de datos (RNF-09).
4. **App Comprador & Calificación** — rastreo en tiempo real, pantalla con el
   código QR/PIN para retirar el paquete y el flujo de calificar la entrega.

Es un proyecto **Expo Router / TypeScript** aislado, pensado para desarrollarse
y demostrarse sin depender todavía de las Edge Functions de Supabase
(Antonio) ni de las pantallas de onboarding/dashboard (Jorge).

## Cómo correrlo

```bash
npm install
npx expo start
```

Escanea el QR con Expo Go (Android) o usa un simulador. Nota: `expo-camera`
y `react-native-maps` son módulos nativos, así que **Expo Go solo funciona
para probar la UI**; para escanear un QR real o ver el mapa con Google Maps
en Android hace falta un *development build* (`npx expo run:android`).

Al abrir la app verás una pantalla "Demo del módulo de Ángel" con dos accesos:
**Repartidor colaborativo** y **Comprador final**. En la app final ese
selector de rol lo resuelve el login/onboarding de Jorge; aquí es solo un
atajo de navegación.

## Estructura

```
src/
  app/                       Pantallas (Expo Router = una ruta por archivo)
    index.tsx                Selector de demo (temporal)
    repartidor/
      index.tsx               Paso 1: Bolsa de Envíos
      ruta/[id].tsx            Paso 2: Mapa y Navegación
      validar/[id].tsx         Paso 3: Escáner y Doble Validación
    comprador/
      index.tsx               Mis pedidos
      seguimiento/[id].tsx     Paso 4: Rastreo, código QR/PIN y calificación
  components/                Tarjetas, mapa, modales de escáner/PIN/calificación...
  services/shipmentsService.ts  Capa de acceso a datos (ver siguiente sección)
  data/mock.ts                Envíos, comercios y puntos PUDO/MiBici de ejemplo
  types/                      Contratos TypeScript alineados a las entidades del ERS
  theme/, utils/              Estilos y helpers (geo, formato de moneda/tiempo)
```

## Integración pendiente con el backend de Antonio

Toda la lógica "de servidor" vive hoy en `src/services/shipmentsService.ts`,
operando en memoria sobre `src/data/mock.ts`. **Ninguna pantalla llama a
`data/mock` directamente**, así que para conectar el backend real basta con
reescribir las funciones de ese archivo para que llamen a Supabase, sin tocar
la UI:

| Función                        | Reemplazar por…                                                   |
| ------------------------------- | ------------------------------------------------------------------ |
| `getBolsa`                      | Query a la tabla `ENVIO` (estado = creado) + Distance Matrix API   |
| `aceptarEnvio`                  | Edge Function que asigna `repartidor_id` de forma atómica          |
| `validarCodigo`                 | Endpoint de validación de QR/PIN (el que genera Antonio)            |
| `getPuntosEncuentro`            | Query a la tabla `PUNTO_ENCUENTRO`                                  |
| `getPedidosComprador`           | Query a `ENVIO` filtrando por comprador autenticado                |
| `calificarEntrega` / `reportarIncidente` | Insert en `CALIFICACION` / tabla de incidentes            |

También hay dos placeholders que Antonio debe sustituir con las llaves reales
de Google Maps Platform en `app.json` (`TU_API_KEY_DE_GOOGLE_MAPS_IOS` /
`TU_API_KEY_DE_GOOGLE_MAPS_ANDROID`), y el botón SOS (`SOSButton`) queda como
punto de enganche para la alerta real vía Twilio/WhatsApp.

## Trazabilidad con el ERS

| Pantalla / componente        | Requisitos cubiertos                              |
| ----------------------------- | --------------------------------------------------- |
| Bolsa de Envíos                | RF-11, RF-12, RF-13, RF-14                          |
| Mapa y Navegación              | RF-16, RF-19, RF-20                                 |
| Escáner y Doble Validación     | RF-22, RF-23, RF-24, RF-25, RNF-09, RNF-10          |
| App Comprador (seguimiento)    | RF-18, RF-26, RF-27                                 |
| Calificación                   | RF-29                                                |

## Comandos útiles

```bash
npx tsc --noEmit     # typecheck
npx expo lint        # lint
npx expo-doctor       # valida configuración/dependencias
```

Todos pasan limpio en el estado actual del proyecto.
