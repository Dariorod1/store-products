# 📖 Documentación Técnica Oficial - Tienda Rooh (E-Commerce Multirrubro)

Bienvenido a la documentación oficial del proyecto **Tienda Rooh**. Este documento contiene el desglose técnico, la arquitectura, el inventario de funcionalidades, las APIs e integraciones externas y la hoja de ruta (*Roadmap*) para futuras características de valor agregado.

---

## 🛠️ 1. Stack Tecnológico

El proyecto está desarrollado utilizando una arquitectura moderna, escalable y performante enfocada en velocidad de carga, excelente experiencia de usuario (UI/UX) e integraciones sin fricción.

### Frontend
- **React 18**: Librería principal para la construcción de interfaces declarativas basadas en componentes.
- **Vite 8**: Build tool y entorno de desarrollo ultra rápido con Hot Module Replacement (HMR).
- **TailwindCSS v4**: Framework de estilos de utilidad para un diseño visual responsivo y estilizado.
- **Lucide React**: Set de iconos vectoriales modernos y livianos.
- **Canvas Confetti**: Efectos de animación interactiva para celebraciones al concretar compras o agregar al carrito.
- **Tipografía Recoleta & Inter**: Fuentes tipográficas optimizadas para una estética boutique pastel.

### Backend & Base de Datos
- **Supabase (PostgreSQL 15)**: Backend como Servicio (BaaS) que provee:
  - Base de datos relacional PostgreSQL para productos, categorías, pedidos, items y logs de búsquedas.
  - **Row Level Security (RLS)** para control de permisos de acceso.
  - **Supabase Storage**: Bucket `product-images` para la carga y almacenamiento público de fotos de productos.

### Pagos & APIs Externas
- **Mercado Pago (Checkout Pro & REST API)**: Integración con la pasarela de pagos líder en Latinoamérica para recibir cobros en pesos argentinos (ARS) mediante Tarjetas de Crédito, Débito, Mercado Crédito, Transferencias y Efectivo (Rapipago/Pagofácil).
- **WhatsApp Web / API Directa**: Generación de pedidos estructurados en formato URL para envío inmediato a la cuenta de WhatsApp del vendedor.

### Despliegue & Servidor
- **Vercel**: Plataforma de hosting y despliegue continuo con integración directa a GitHub.
- **Vercel Serverless Functions**: Endpoint `/api/create-preference.js` escrito en Node.js que genera las preferencias de cobro de Mercado Pago de forma segura en el servidor sin exponer claves secretas.

---

## 📁 2. Estructura del Proyecto

```text
storeProducts/
├── api/
│   └── create-preference.js    # Function Serverless en Vercel para preferenciar cobros en Mercado Pago
├── public/                     # Archivos estáticos e imágenes públicas
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminLayout.jsx # Contenedor del Panel Admin con navegación por solapas
│   │   │   ├── OrdersList.jsx  # Historial de pedidos + Modal de detalle de pedido
│   │   │   └── ...
│   │   ├── CartDrawer.jsx      # Drawer lateral del carrito + Selección de método de pago
│   │   ├── CategoryFilter.jsx  # Selector de categorías por pestañas/chips
│   │   ├── Header.jsx          # Barra superior responsiva con buscador y branding
│   │   ├── HeroBanner.jsx      # Banner destacado del Home
│   │   ├── ProductCard.jsx     # Tarjeta individual de producto con hover y badges
│   │   ├── ProductDetailModal.jsx # Modal de inspección de producto
│   │   ├── SidebarMenu.jsx     # Menú hamburguesa para dispositivos móviles
│   │   └── WhatsAppButton.jsx  # Botón flotante de contacto
│   ├── context/
│   │   └── CartContext.jsx     # Estado global del carrito (persistencia en localStorage)
│   ├── lib/
│   │   ├── config.js           # Variables globales de la tienda (Nombre, Subtítulo, WhatsApp)
│   │   └── supabase.js         # Cliente de conexión a Supabase DB & Storage
│   ├── services/
│   │   └── mercadopago.js      # Servicio cliente de generación de checkout con MP
│   ├── utils/
│   │   └── formatters.js       # Formateadores de moneda (ARS), descuentos y URLs de WhatsApp
│   ├── App.jsx                 # Componente principal y lógica de vista cliente/admin
│   └── main.jsx                # Punto de entrada de React
├── .env                        # Variables de entorno locales (git-ignored)
├── .env.example                # Plantilla de variables de entorno pública
├── supabase_schema.sql         # Script SQL completo de tablas, políticas RLS y datos iniciales
└── vite.config.js              # Configuración de Vite con soporte para envPrefix sin VITE_
```

---

## 🚀 3. Funcionalidades Detalladas

### 🛒 1. Carrito de Compras & Flujo de Pago Dual
- **Persistencia Local**: El carrito se conserva en `localStorage` del navegador para que el usuario no pierda sus productos al recargar.
- **Formulario de Envíos**: Captura Nombre completo, Teléfono/WhatsApp, Dirección de entrega y Notas o especificaciones del pedido (talle, color, etc.).
- **Checkout por Mercado Pago**:
  - Al hacer clic en *"Pagar con Mercado Pago"*, el sistema registra automáticamente la orden en Supabase en estado `pending`.
  - Envía la solicitud a `/api/create-preference.js` y redirige al cliente al checkout seguro de Mercado Pago.
- **Checkout por WhatsApp**:
  - Al hacer clic en *"Finalizar Pedido por WhatsApp"*, registra la orden en la BD y abre un chat con el vendedor conteniendo la lista itemizada y formateada con emojis.

### 🛡️ 2. Panel de Administración Integrado
- **Acceso Directo**: Pestaña dedicada en la barra de navegación para la gestión del negocio.
- **Gestión de Productos**:
  - Crear, editar y eliminar productos en tiempo real.
  - Subida de imágenes a **Supabase Storage** con soporte para Drag & Drop y captura directa desde la cámara del celular.
- **Historial de Pedidos (`OrdersList`) & Modal de Detalle**:
  - Lista de todos los pedidos recibidos ordenados por fecha.
  - **Modal interactivo al hacer clic en cualquier pedido**: Muestra la información del cliente, dirección, notas, desglose de ítems comprados (con precio unitario y subtotal), monto total, y enlace directo para escribirle por WhatsApp.
  - Botón *"Copiar Resumen"* para pegar el detalle del pedido en cualquier chat o nota.
  - Cambio de estado en tiempo real (*Pendiente*, *Completado*, *Cancelado*).

### 🔍 3. Buscador en Vivo & Registro de Métricas Popular
- **Filtro Instantáneo**: Búsqueda por texto en tiempo real sobre el título y descripción de los productos.
- **Filtro por Categorías**: Al seleccionar una categoría desde el menú hamburguesa o los chips, la vista se enfoca exclusivamente en los productos de esa categoría.
- **Persistencia de Búsquedas (Métricas de Búsqueda)**:
  - Registro de términos buscados por los clientes en Supabase.
  - Cálculo del promedio de búsquedas de los últimos 7 días con prevención de duplicados instantáneos para mostrar las tendencias reales al administrador.

### 🎨 4. Branding & Personalización
- **Configuración mediante Variables de Entorno**: El nombre de la tienda y el subtítulo se leen dinámicamente (`STORE_NAME="Tienda Rooh - Tienda Multirrubro"`).
- **Icono Favicon Personalizado**: SVG optimizado adaptado al estilo pastel boutique de la tienda.
- **Diseño Responsivo**: Adaptación total a dispositivos móviles, tablets y monitores de alta resolución.

---

## 🔑 4. Variables de Entorno

El proyecto soporta nombres de variables sin prefijo `VITE_` para facilitar la edición directa en el panel de **Vercel**:

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `SUPABASE_URL` | URL de la instancia de Supabase | `https://xxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Clave pública anónima de Supabase | `eyJhbGciOi...` |
| `WHATSAPP_NUMBER` | Número de teléfono para recibir compras | `5493863434888` |
| `STORE_NAME` | Nombre completo de la tienda | `"Tienda Rooh - Tienda Multirrubro"` |
| `MP_PUBLIC_KEY` | Public Key de Mercado Pago | `APP_USR-xxxx...` |
| `MP_ACCESS_TOKEN` | Access Token de Mercado Pago (Servidor) | `APP_USR-xxxx...` |

---

## 🗺️ 5. Plan de Nuevas Características (Roadmap de Futuro)

A continuación se presenta un plan estratégico de nuevas funcionalidades diseñadas para incrementar el valor del negocio, mejorar la retención de clientes y optimizar las ventas:

### 🌟 Fase 1: Optimización de Conversión & Fidelización (Corto Plazo)

1. 🏷️ **Cupones de Descuento & Códigos Promocionales**
   - Permitir al admin crear códigos (ej: `ROOH10`, `BIENVENIDA2026`) con descuento fijo ($) o porcentual (%).
   - Validación del código dentro del carrito antes de ir a pagar.

2. ⭐️ **Reseñas & Valoraciones de Clientes (Reviews)**
   - Permitir a los compradores dejar estrellas (1 a 5) y comentarios en la ficha de cada producto.
   - Moderación desde el Panel Admin para aprobar o destacar reseñas.

3. 🔔 **Alertas de Stock Bajo & Control de Inventario**
   - Notificación visual en el Panel Admin cuando un producto tenga menos de 3 unidades en stock.
   - Badge de *"¡Últimas unidades disponibles!"* en la tarjeta del producto para crear sentido de urgencia (FOMO).

---

### 📈 Fase 2: Automatización & Reportes Financieros (Mediano Plazo)

4. 📊 **Dashboard Avanzado de Reportes Financieros**
   - Gráficos interactivos de ingresos por día/semana/mes.
   - Productos más vendidos (Top Sales) y categorías con mayor recaudación.

5. 📥 **Exportación de Historial de Pedidos (Excel / CSV / PDF)**
   - Botón para descargar el reporte de ventas del mes en formato Excel/CSV para contabilidad.
   - Opción para generar e imprimir facturas/remitos sencillos en PDF para adjuntar a los envíos.

6. 📦 **Seguimiento de Estado del Pedido por WhatsApp / Email**
   - Notificación automática con un clic desde el Panel Admin enviando una plantilla de WhatsApp al cliente cuando su pedido cambie de `Pendiente` a `Completado / Enviado`.

---

### 🚀 Fase 3: Escalabilidad & Experiencia Premium (Largo Plazo)

7. 🌙 **Modo Oscuro (Dark Mode Toggle)**
   - Interruptor en el header para alternar entre el tema pastel claro actual y una versión nocturna elegante.

8. 🌐 **Soporte Multimoneda & Multilenguaje**
   - Selector de moneda (ARS / USD) y conversión de tipo de cambio automática para clientes internacionales.

9. 👤 **Perfiles de Usuarios / Clientes Registrados**
   - Permite a los clientes crear una cuenta, guardar sus direcciones habituales y ver el historial de sus compras pasadas.

---

*Documentación creada para Tienda Rooh - 2026.*
