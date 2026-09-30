import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

serve(async (req) => {
  try {
    const { codigo_paquete, pin_dinamico } = await req.json()

    if (!codigo_paquete || !pin_dinamico) {
       return new Response(JSON.stringify({ error: "Faltan parametros" }), { status: 400 })
    }

    // Inicializar Supabase para consultar la base de datos usando variables de entorno
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Buscar el envío en la base de datos
    const { data: envio, error } = await supabaseClient
      .from('envio')
      .select('*')
      .eq('codigo_paquete', codigo_paquete)
      .single()

    if (error || !envio) {
       return new Response(JSON.stringify({ error: "Envío no encontrado" }), { status: 404 })
    }

    // Validar el PIN
    if (envio.pin_dinamico === pin_dinamico) {
        // Actualizar el estado del envío a ENTREGADO si el pin es correcto
        await supabaseClient
          .from('envio')
          .update({ estado: 'ENTREGADO' })
          .eq('id', envio.id)
          
        return new Response(
          JSON.stringify({ success: true, message: "Validación exitosa, paquete entregado" }),
          { headers: { "Content-Type": "application/json" } },
        )
    } else {
        return new Response(
          JSON.stringify({ success: false, error: "PIN incorrecto" }),
          { status: 401, headers: { "Content-Type": "application/json" } },
        )
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }
})
