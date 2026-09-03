-- =========================================================================
-- ESQUEMA COMPLETO DE BASE DE DATOS Y DATOS SEMILLA PARA SUPABASE
-- Ejecuta este script en el SQL Editor de tu panel de Supabase
-- =========================================================================

-- 1. Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla de Categorías
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT DEFAULT 'ShoppingBag',
    color TEXT DEFAULT 'from-violet-500 to-purple-600',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla de Productos
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    category_slug TEXT,
    image_url TEXT NOT NULL,
    stock INTEGER DEFAULT 10 NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    tags TEXT[] DEFAULT '{}',
    badge TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabla de Pedidos / Compras
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT,
    notes TEXT,
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabla de Items de Pedido
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_title TEXT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL
);

-- =========================================================================
-- HABILITAR POLÍTICAS DE SEGURIDAD (RLS - ROW LEVEL SECURITY)
-- =========================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Permitir a cualquier usuario ver categorías y productos activos
CREATE POLICY "Permitir lectura publica de categorias" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Permitir lectura publica de productos" ON public.products FOR SELECT USING (true);

-- Permitir a cualquier usuario crear pedidos y items de pedido
CREATE POLICY "Permitir crear pedidos a clientes" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir crear items de pedido a clientes" ON public.order_items FOR INSERT WITH CHECK (true);

-- Permitir modificación total (Crear, Editar, Eliminar) para operaciones (usando anon key o usuarios autenticados)
CREATE POLICY "Permitir modificacion de productos" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir modificacion de categorias" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir modificacion de pedidos" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir lectura de pedidos" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Permitir lectura de items" ON public.order_items FOR SELECT USING (true);

-- =========================================================================
-- DATOS SEMILLA (CATEGORÍAS Y PRODUCTOS DE DEMOSTRACIÓN)
-- =========================================================================

-- Insertar Categorías
INSERT INTO public.categories (name, slug, description, icon, color) VALUES
('Ropa & Moda', 'ropa', 'Prendas urbanas, camperas, remeras y calzado de tendencia', 'Shirt', 'from-pink-500 to-rose-600'),
('Perfumes & Fragancias', 'perfumes', 'Fragancias exclusivas, perfumes importados y body splash', 'Sparkles', 'from-purple-500 to-indigo-600'),
('Juguetes & Juegos', 'juguetes', 'Juguetes para todas las edades, juegos de mesa y de colección', 'Gamepad2', 'from-amber-400 to-orange-500'),
('Electrónica & Tech', 'electronica', 'Auriculares, smartwatches, parlantes y accesorios móviles', 'Headphones', 'from-cyan-500 to-blue-600'),
('Hogar & Accesorios', 'hogar', 'Deco, termos, mochilas y artículos esenciales para el día a día', 'Home', 'from-emerald-500 to-teal-600')
ON CONFLICT (slug) DO NOTHING;

-- Insertar Productos de Muestra
INSERT INTO public.products (title, slug, description, price, original_price, category_slug, image_url, stock, is_featured, is_active, badge, tags) VALUES
(
    'Campera Bomber Urbana Oversize Premium',
    'campera-bomber-urbana-oversize',
    'Campera bomber unisex con tela impermeable, forro térmico interno y bolsillos profundos. Ideal para otoño-invierno.',
    48500.00,
    62000.00,
    'ropa',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    15,
    true,
    true,
    'MÁS VENDIDO',
    ARRAY['ropa', 'campera', 'invierno', 'moda']
),
(
    'Perfume Noir Extreme Eau de Parfum 100ml',
    'perfume-noir-extreme-100ml',
    'Fragancia intensa con notas de ámbar, especias cálidas, vainilla y maderas finas. Larga duración 24h.',
    54900.00,
    69000.00,
    'perfumes',
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    8,
    true,
    true,
    'OFERTA TOP',
    ARRAY['perfume', 'fragancia', 'elegante', 'hombre']
),
(
    'Auto Todoterreno RC 4x4 Alta Velocidad',
    'auto-todoterreno-rc-4x4',
    'Vehículo a control remoto con amortiguadores independientes, luces LED y batería recargable USB de larga duración.',
    32500.00,
    41000.00,
    'juguetes',
    'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80',
    20,
    true,
    true,
    'NUEVO',
    ARRAY['juguete', 'control remoto', 'niños', 'diversion']
),
(
    'Auriculares Bluetooth Pro ANC Cancelación de Ruido',
    'auriculares-bluetooth-pro-anc',
    'Audio de alta fidelidad, estuche de carga con pantalla táctil, 30 horas de autonomía y resistencia al agua IPX5.',
    28900.00,
    38000.00,
    'electronica',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    25,
    true,
    true,
    '25% OFF',
    ARRAY['auriculares', 'tech', 'audio', 'bluetooth']
),
(
    'Perfume Velvet Rose & Oud Luxe 50ml',
    'perfume-velvet-rose-oud-50ml',
    'Fragancia seductora floral oriental con rosas búlgaras, clavo de olor y madera de agar. Presentación en frasco de cristal.',
    42000.00,
    52000.00,
    'perfumes',
    'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
    12,
    true,
    true,
    'EXCLUSIVO',
    ARRAY['perfume', 'mujer', 'lujo', 'fragancia']
),
(
    'Zapatillas Urban Retro Skate Unisex',
    'zapatillas-urban-retro-skate',
    'Zapatillas con suela antideslizante, costuras reforzadas y plantilla acolchada para máxima comodidad todo el día.',
    39900.00,
    49000.00,
    'ropa',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    18,
    true,
    true,
    'TENDENCIA',
    ARRAY['zapatillas', 'calzado', 'moda', 'ropa']
),
(
    'Oso de Peluche Gigante 1 metro Extrasuave',
    'oso-de-peluche-gigante-1m',
    'Confeccionado con felpa antialérgica ultra suave. El regalo perfecto para ocasiones especiales.',
    27500.00,
    35000.00,
    'juguetes',
    'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80',
    10,
    false,
    true,
    'REGALO IDEAL',
    ARRAY['peluche', 'juguete', 'amor', 'regalo']
),
(
    'Smartwatch AMOLED Deportivo con GPS Integrado',
    'smartwatch-amoled-deportivo-gps',
    'Monitoreo cardíaco 24/7, medición de oxígeno SpO2, más de 50 modos deportivos y notificaciones en tiempo real.',
    36900.00,
    48000.00,
    'electronica',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    14,
    true,
    true,
    'MÁS BARRATO',
    ARRAY['reloj', 'smartwatch', 'deporte', 'tech']
),
(
    'Remera Streetwear Oversize Cotton 100%',
    'remera-streetwear-oversize-cotton',
    'Algodón peinado 24/1 de primera calidad. Estampa en serigrafía de alta durabilidad sin desgaste.',
    18500.00,
    24000.00,
    'ropa',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    30,
    false,
    true,
    'OFERTA',
    ARRAY['remera', 'streetwear', 'ropa', 'algodon']
),
(
    'Juego de Mesa ESTRATEGIA SUPREMA Edición Especial',
    'juego-de-mesa-estrategia-suprema',
    'Contiene tablero desplegable gigante, 300 miniaturas detalladas y cartas con acabados plastificados.',
    29800.00,
    37000.00,
    'juguetes',
    'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80',
    7,
    false,
    true,
    'FAMILIAR',
    ARRAY['juegos', 'mesa', 'amigos', 'juguetes']
),
(
    'Parlante Bluetooth WaterProof Bass 20W',
    'parlante-bluetooth-waterproof-20w',
    'Sonido envolvente 360 grados, bajos profundos, luces LED rítmicas RGB y batería de 12 horas seguidas.',
    24500.00,
    32000.00,
    'electronica',
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
    22,
    false,
    true,
    'IMPERDIBLE',
    ARRAY['parlante', 'musica', 'bluetooth', 'tech']
),
(
    'Termo de Acero Inoxidable 1.2L TermoPro',
    'termo-acero-inoxidable-1-2l',
    'Mantiene bebidas frías o calientes por 24 horas. Doble capa al vacío con tapón cebador ergonómico.',
    31000.00,
    39000.00,
    'hogar',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    16,
    false,
    true,
    'CALIDAD TOP',
    ARRAY['termo', 'mate', 'hogar', 'acero']
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    image_url = EXCLUDED.image_url,
    stock = EXCLUDED.stock,
    is_featured = EXCLUDED.is_featured,
    badge = EXCLUDED.badge;

-- =========================================================================
-- SUPABASE STORAGE — Bucket para imágenes de productos
-- =========================================================================

-- Crear el bucket (public = las imágenes son accesibles por URL sin auth)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760,  -- 10 MB máximo por imagen
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Política: cualquier usuario autenticado o anónimo puede SUBIR imágenes
CREATE POLICY "Permitir subida de imagenes de productos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- Política: cualquier persona puede VER/LEER las imágenes (URLs públicas)
CREATE POLICY "Permitir lectura publica de imagenes"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Política: permitir eliminar imágenes (para cuando el admin borra un producto)
CREATE POLICY "Permitir eliminar imagenes de productos"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');

