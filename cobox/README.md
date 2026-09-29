# COBOX

Plataforma móvil de logística colaborativa de última milla para comercio
local en la Zona Metropolitana de Guadalajara y Zapopan, usando puntos de
encuentro seguros PUDO (Pick-up and Drop-off).

Ver la especificación completa en [`docs/ERS COBOX.pdf`](./docs/ERS%20COBOX.pdf)
y los mockups en [`docs/DISEÑO COBOX.pdf`](./docs/DISE%C3%91O%20COBOX.pdf).

## Estructura del repo

```
cobox/
├── mobile/       App móvil única (React Native / Expo, TypeScript).
│                 Todos los roles (Comerciante, Repartidor, Comprador)
│                 viven en este mismo proyecto, con navegación por rol.
├── supabase/     Servidor Central: base de datos, Auth, Storage y
│                 Edge Functions (Antonio). Ver supabase/README.md.
└── docs/         ERS, mockups de diseño y división de trabajo del equipo.
```

## División de trabajo

| Quién  | Parte                                                                 |
| ------ | ---------------------------------------------------------------------- |
| Antonio | Supabase: base de datos, Auth, Storage, Edge Functions, APIs externas |
| Jorge   | Onboarding/KYC, registro de negocio, dashboard, crear envío (Comerciante) |
| Ángel   | Bolsa de envíos, mapa/navegación, escáner de doble validación, app Comprador |

Detalle completo en [`docs/division trabajo.docx`](./docs/division%20trabajo.docx).

## Cómo correr la app móvil

```bash
cd mobile
npm install
npx expo start
```

Ver [`mobile/README.md`](./mobile/README.md) para más detalle, incluyendo
qué partes de `shipmentsService.ts` hay que reemplazar cuando el backend de
Antonio esté listo.

## Flujo de trabajo del equipo

Gestión ágil con GitHub Projects/Issues, usando etiquetas para diferenciar
tareas de la app (`mobile`) y del servidor central (`supabase`), tal como
define el ERS.
