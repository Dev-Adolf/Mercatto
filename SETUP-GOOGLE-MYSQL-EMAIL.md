# Mercatto — Guía de configuración (MySQL, Google Auth, Correo)

Esta guía cubre lo que agregué/ajusté en el proyecto:
1. Base de datos MySQL
2. Login con Google
3. Envío de correo al crear pedidos

---

## 1. Base de datos MySQL

El backend ya está configurado en `mercatto-backend/src/main/resources/application.properties`
para crear la base de datos automáticamente (`createDatabaseIfNotExist=true`) y con
`spring.jpa.hibernate.ddl-auto=update`, así que **Hibernate crea/actualiza las tablas solo**
a partir de las entidades la primera vez que arranca la aplicación. No necesitas correr
`schema.sql` manualmente (ese archivo quedó como referencia/documentación, ya actualizado
con las columnas nuevas de Google).

Pasos en tu máquina (Ubuntu):

```bash
# 1. Instala MySQL si no lo tienes
sudo apt update
sudo apt install mysql-server -y
sudo systemctl enable --now mysql

# 2. Entra a MySQL como root y crea el usuario/permmisos que usará la app
sudo mysql
```

Dentro de la consola de MySQL:

```sql
CREATE DATABASE IF NOT EXISTS mercatto_db;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mercatto123';
FLUSH PRIVILEGES;
EXIT;
```

> Si prefieres no usar `root`, crea un usuario dedicado:
> ```sql
> CREATE USER 'mercatto'@'localhost' IDENTIFIED BY 'mercatto123';
> GRANT ALL PRIVILEGES ON mercatto_db.* TO 'mercatto'@'localhost';
> FLUSH PRIVILEGES;
> ```
> y actualiza `spring.datasource.username` / `spring.datasource.password` en
> `application.properties` con esos valores.

Con eso, al ejecutar `mvn spring-boot:run` (o el jar), Spring creará la base de datos y
todas las tablas automáticamente. Puedes verificarlo con:

```bash
mysql -u root -p -e "USE mercatto_db; SHOW TABLES;"
```

---

## 2. Login con Google

### 2.1 Crear las credenciales en Google Cloud Console

1. Ve a https://console.cloud.google.com/apis/credentials
2. Crea un proyecto (o usa uno existente).
3. **Pantalla de consentimiento OAuth**: configúrala en modo "Externo", agrega tu correo
   como usuario de prueba si el proyecto no está publicado.
4. **Crear credenciales → ID de cliente de OAuth**:
   - Tipo de aplicación: **Aplicación web**
   - Orígenes de JavaScript autorizados:
     - `http://localhost:5173` (dev de Vite)
     - el dominio real cuando despliegues (ej. `https://tudominio.com`)
   - No hace falta URI de redirección (usamos el flujo de Google Identity Services
     con botón, no el redirect clásico).
5. Copia el **Client ID** generado (termina en `.apps.googleusercontent.com`).

### 2.2 Configurar backend

En `mercatto-backend/src/main/resources/application.properties`:

```properties
google.client-id=TU_CLIENT_ID_REAL.apps.googleusercontent.com
```

### 2.3 Configurar frontend

Crea `mercatto-frontend/.env` (basado en `.env.example`):

```
VITE_API_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=TU_CLIENT_ID_REAL.apps.googleusercontent.com
```

**Importante:** el Client ID del backend y del frontend deben ser idénticos.

### 2.4 Cómo funciona

- El frontend carga el script de Google (`accounts.google.com/gsi/client`) y muestra un
  botón "Continuar con Google" en `/login` y `/registro`.
- Al hacer clic, Google entrega un **ID Token** (JWT) al frontend.
- El frontend lo envía a `POST /api/auth/google` con `{ "credential": "<id_token>" }`.
- El backend valida ese token contra el endpoint público `tokeninfo` de Google
  (verifica firma, audiencia = tu Client ID, y que el correo esté verificado).
- Si el correo ya existe, se vincula la cuenta de Google a ese usuario; si no existe,
  se crea un usuario nuevo con rol `COMPRADOR`, sin contraseña local.
- Responde con `accessToken` / `refreshToken` igual que el login normal.

No se requiere ninguna librería adicional de Google en el backend.

---

## 3. Envío de correo al realizar pedidos

Usa el `spring-boot-starter-mail` que ya estaba en el `pom.xml`, con SMTP de Gmail.

### 3.1 Generar una contraseña de aplicación de Gmail

Gmail no permite usar tu contraseña normal desde apps externas. Necesitas una
"contraseña de aplicación":

1. Activa la verificación en 2 pasos en tu cuenta de Google (obligatorio):
   https://myaccount.google.com/security
2. Ve a https://myaccount.google.com/apppasswords
3. Genera una contraseña para "Correo" / "Otra (nombre personalizado)" → escribe "Mercatto".
4. Copia la contraseña de 16 caracteres (sin espacios).

### 3.2 Configurar backend

En `application.properties`:

```properties
spring.mail.username=tu_correo_real@gmail.com
spring.mail.password=lapasswordde16caracteres
```

### 3.3 Qué se envía

Al crear un pedido (`POST /api/pedidos`), automáticamente y de forma asíncrona
(no bloquea la respuesta al usuario):

- **Al comprador**: correo HTML de confirmación con el código del pedido, el detalle
  de productos/cantidades/subtotales, descuento, envío y total.
- **A cada vendedor involucrado**: un correo de "nueva venta" solo con sus propios
  productos del pedido y el total que le corresponde a él.

Si `spring.mail.username`/`password` quedan con los valores de ejemplo (`TU_CORREO@gmail.com`),
el sistema simplemente **omite el envío silenciosamente** (queda un log informativo) sin
romper la creación del pedido — así puedes seguir desarrollando sin tener el correo
configurado todavía.

---

## Resumen de archivos nuevos/modificados

**Backend**
- `model/Usuario.java` — password nullable, campos `proveedor` y `googleId`
- `service/GoogleTokenService.java` — nuevo, verifica ID Token de Google
- `service/AuthService.java` — nuevo método `loginConGoogle(...)`, login normal protegido
- `controller/AuthController.java` — nuevo endpoint `POST /api/auth/google`
- `dto/request/GoogleAuthRequest.java` — nuevo
- `service/EmailService.java` — reescrito, agrega HTML y notificaciones de pedido
- `service/PedidoService.java` — envía correos al crear un pedido
- `MercattoApplication.java` — `@EnableAsync`
- `resources/schema.sql` — columnas nuevas de Google (referencia)
- `resources/application.properties` — `google.client-id`

**Frontend**
- `index.html` — script de Google Identity Services
- `utils/constants.js` — `GOOGLE_CLIENT_ID`
- `services/authService.js` — `loginGoogle(...)`
- `context/AuthContext.jsx` — `loginGoogle(...)`
- `components/common/GoogleLoginButton.jsx` — nuevo
- `pages/Login.jsx`, `pages/Registro.jsx` — botón de Google integrado
- `.env.example` — nuevo
