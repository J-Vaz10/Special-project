# COBOX

Plataforma móvil de logística colaborativa de última milla para comercio
local en la Zona Metropolitana de Guadalajara y Zapopan, usando puntos de
encuentro seguros PUDO (Pick-up and Drop-off).

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
