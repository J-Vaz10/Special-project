import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    // 1. Generar código único de paquete (ej. CBX-240918-01)
    const date = new Date();
    const dateString = `${date.getFullYear().toString().slice(2)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    const randomSuffix = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    const codigoPaquete = `CBX-${dateString}-${randomSuffix}`;

    // 2. Generar PIN dinámico de 4 dígitos
    const pinDinamico = Math.floor(1000 + Math.random() * 9000).toString(); // Ej. 8974

    const data = {
      codigo_paquete: codigoPaquete,
      pin_dinamico: pinDinamico
    };

    return new Response(
      JSON.stringify(data),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }
})
