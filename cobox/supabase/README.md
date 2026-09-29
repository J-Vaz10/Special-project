# COBOX — Servidor Central (Antonio)

Backend BaaS sobre Supabase: base de datos PostgreSQL, autenticación, storage y
Edge Functions.

Estructura sugerida (convención del CLI de Supabase, `supabase init`):

```
supabase/
  config.toml           Configuración del proyecto Supabase (generado por `supabase init`)
  migrations/            Migraciones SQL: tablas USUARIOS, NEGOCIO, ENVIO,
                          PUNTO_ENCUENTRO, CALIFICACION y sus relaciones
  functions/              Edge Functions en TypeScript, p. ej.:
                          - generar-codigo-envio/   (código único CBX-xxx + PIN)
                          - validar-qr-pin/          (doble validación en comercio/PUDO)
```

## Contrato con la app móvil

El módulo de Ángel (`mobile/src/services/shipmentsService.ts`) ya está escrito
contra las firmas que deberían exponer estas funciones. Ver la tabla de
mapeo en `mobile/README.md` ("Integración pendiente con el backend de
Antonio") para la correspondencia función-a-función.

## Variables de entorno / secretos

Las API Keys reales (Google Maps, Twilio/WhatsApp) **no se suben al repo**.
Van como secretos de Supabase (`supabase secrets set ...`) o variables de
entorno del proyecto, nunca hardcodeadas.
