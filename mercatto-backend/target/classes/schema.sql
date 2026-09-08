-- ================================================================
-- MERCATTO MARKETPLACE - Script DDL de Base de Datos
-- Compatible con MySQL 8 / MariaDB / PostgreSQL
-- ================================================================

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'COMPRADOR',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    email_verificado BOOLEAN NOT NULL DEFAULT FALSE,
    foto_perfil VARCHAR(500),
    telefono VARCHAR(20),
    proveedor VARCHAR(20) NOT NULL DEFAULT 'LOCAL',
    google_id VARCHAR(100),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_login DATETIME
);

CREATE TABLE IF NOT EXISTS vendedores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL UNIQUE,
    tipo VARCHAR(20) NOT NULL DEFAULT 'PERSONA_NATURAL',
    nombre_tienda VARCHAR(150) NOT NULL,
    descripcion TEXT,
    logo_url VARCHAR(500),
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    nit_cedula VARCHAR(30),
    razon_social VARCHAR(200),
    ciudad VARCHAR(100),
    direccion VARCHAR(300),
    cuenta_bancaria VARCHAR(50),
    banco VARCHAR(100),
    calificacion DOUBLE DEFAULT 0.0,
    total_ventas INT DEFAULT 0,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categorias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(500),
    icono VARCHAR(100),
    imagen_url VARCHAR(500),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    orden_visual INT DEFAULT 0,
    padre_id BIGINT,
    FOREIGN KEY (padre_id) REFERENCES categorias(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendedor_id BIGINT NOT NULL,
    categoria_id BIGINT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    slug VARCHAR(250) NOT NULL UNIQUE,
    descripcion TEXT NOT NULL,
    precio DOUBLE NOT NULL,
    precio_oferta DOUBLE,
    stock INT NOT NULL DEFAULT 0,
    sku VARCHAR(100),
    marca VARCHAR(100),
    estado VARCHAR(30) DEFAULT 'NUEVO',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    destacado BOOLEAN NOT NULL DEFAULT FALSE,
    calificacion DOUBLE DEFAULT 0.0,
    total_resenas INT DEFAULT 0,
    total_ventas INT DEFAULT 0,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendedor_id) REFERENCES vendedores(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS producto_imagenes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    producto_id BIGINT NOT NULL,
    url VARCHAR(600) NOT NULL,
    public_id VARCHAR(200),
    principal BOOLEAN NOT NULL DEFAULT FALSE,
    orden_visual INT DEFAULT 0,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS producto_variantes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    producto_id BIGINT NOT NULL,
    sku VARCHAR(100),
    nombre VARCHAR(150) NOT NULL,
    precio DOUBLE NOT NULL,
    precio_oferta DOUBLE,
    stock INT NOT NULL DEFAULT 0,
    imagen_url VARCHAR(600),
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS variante_atributos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    variante_id BIGINT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    valor VARCHAR(100) NOT NULL,
    FOREIGN KEY (variante_id) REFERENCES producto_variantes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS direcciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion VARCHAR(250) NOT NULL,
    barrio VARCHAR(150),
    ciudad VARCHAR(100) NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(20),
    notas_entrega VARCHAR(300),
    es_principal BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cupones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    tipo VARCHAR(20) NOT NULL DEFAULT 'PORCENTAJE',
    valor DOUBLE NOT NULL,
    monto_minimo DOUBLE DEFAULT 0.0,
    descuento_maximo DOUBLE,
    usos_maximos INT,
    usos_actuales INT DEFAULT 0,
    fecha_inicio DATETIME,
    fecha_fin DATETIME,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS pedidos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    comprador_id BIGINT NOT NULL,
    direccion_id BIGINT,
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
    subtotal DOUBLE NOT NULL DEFAULT 0.0,
    descuento DOUBLE NOT NULL DEFAULT 0.0,
    costo_envio DOUBLE NOT NULL DEFAULT 0.0,
    total DOUBLE NOT NULL DEFAULT 0.0,
    cupon_id BIGINT,
    guia_seguimiento VARCHAR(100),
    empresa_envio VARCHAR(100),
    notas TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comprador_id) REFERENCES usuarios(id),
    FOREIGN KEY (direccion_id) REFERENCES direcciones(id),
    FOREIGN KEY (cupon_id) REFERENCES cupones(id)
);

CREATE TABLE IF NOT EXISTS pedido_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pedido_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    variante_id BIGINT,
    vendedor_id BIGINT NOT NULL,
    nombre_producto VARCHAR(200) NOT NULL,
    nombre_variante VARCHAR(150),
    imagen_url VARCHAR(600),
    precio_unitario DOUBLE NOT NULL,
    cantidad INT NOT NULL,
    subtotal DOUBLE NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (variante_id) REFERENCES producto_variantes(id),
    FOREIGN KEY (vendedor_id) REFERENCES vendedores(id)
);

CREATE TABLE IF NOT EXISTS pagos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pedido_id BIGINT NOT NULL UNIQUE,
    metodo VARCHAR(30) NOT NULL DEFAULT 'STRIPE',
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
    monto DOUBLE NOT NULL,
    moneda VARCHAR(10) DEFAULT 'cop',
    transaccion_id VARCHAR(200),
    payment_method_id VARCHAR(200),
    detalles_pago TEXT,
    fecha_pago DATETIME,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mensajes_contacto (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    producto_id BIGINT NOT NULL,
    comprador_id BIGINT NOT NULL,
    vendedor_id BIGINT NOT NULL,
    pedido_id BIGINT,
    asunto VARCHAR(150) DEFAULT 'Consulta sobre el producto',
    mensaje TEXT NOT NULL,
    es_de_comprador BOOLEAN NOT NULL DEFAULT TRUE,
    leido BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (comprador_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (vendedor_id) REFERENCES vendedores(id) ON DELETE CASCADE,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS resenas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    producto_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    calificacion INT NOT NULL,
    titulo VARCHAR(150),
    comentario TEXT,
    compra_verificada BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY uq_usuario_producto (usuario_id, producto_id)
);

CREATE TABLE IF NOT EXISTS favoritos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    fecha_agregado DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE KEY uq_usuario_fav_prod (usuario_id, producto_id)
);
