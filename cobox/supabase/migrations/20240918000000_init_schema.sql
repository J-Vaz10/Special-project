-- Paso 1: Crear las 5 tablas principales

-- Tabla USUARIOS
CREATE TABLE public.usuarios (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefono TEXT,
    rol TEXT CHECK (rol IN ('CLIENTE', 'REPARTIDOR', 'ADMIN')) NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla NEGOCIO
CREATE TABLE public.negocio (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre TEXT NOT NULL,
    direccion TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla PUNTO_ENCUENTRO
CREATE TABLE public.punto_encuentro (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    latitud DOUBLE PRECISION NOT NULL,
    longitud DOUBLE PRECISION NOT NULL,
    direccion TEXT,
    descripcion TEXT
);

-- Tabla ENVIO
CREATE TABLE public.envio (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    codigo_paquete TEXT UNIQUE NOT NULL,
    pin_dinamico TEXT NOT NULL,
    id_negocio UUID REFERENCES public.negocio(id),
    id_cliente UUID REFERENCES public.usuarios(id),
    id_repartidor UUID REFERENCES public.usuarios(id),
    id_punto_encuentro UUID REFERENCES public.punto_encuentro(id),
    estado TEXT DEFAULT 'PENDIENTE' NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla CALIFICACION
CREATE TABLE public.calificacion (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    id_envio UUID REFERENCES public.envio(id) NOT NULL,
    id_calificador UUID REFERENCES public.usuarios(id) NOT NULL,
    id_calificado UUID REFERENCES public.usuarios(id) NOT NULL,
    puntuacion INTEGER CHECK (puntuacion >= 1 AND puntuacion <= 5),
    comentario TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- Paso 2: Configurar un "Bucket" de almacenamiento seguro para fotos INE/Pasaporte y selfies KYC.

INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc-documents', 'kyc-documents', false);

-- Políticas de seguridad para el bucket (ejemplo: solo el usuario dueño puede leer/escribir)
CREATE POLICY "Documentos KYC son privados"
ON storage.objects FOR SELECT
USING ( bucket_id = 'kyc-documents' AND auth.uid() = owner );

CREATE POLICY "Usuarios pueden subir sus documentos KYC"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'kyc-documents' AND auth.uid() = owner );
