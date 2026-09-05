# Mercatto — Marketplace Multi-categoría

Stack: React 18 + Spring Boot 3 + MySQL 8 + Stripe + Cloudinary

## Estructura
- mercatto-backend/   → API REST con Spring Boot, JWT y MySQL
- mercatto-frontend/  → Interfaz de usuario con React y Tailwind CSS

## Roles
- VISITANTE    → Ve catálogo y productos sin registrarse
- COMPRADOR    → Compra, favoritos, reseñas, pedidos
- VENDEDOR     → Publica productos, gestiona pedidos y cupones
- ADMIN        → Control total de la plataforma

## Arrancar el proyecto
### Backend
cd mercatto-backend && mvn spring-boot:run

### Frontend
cd mercatto-frontend && npm install && npm run dev
