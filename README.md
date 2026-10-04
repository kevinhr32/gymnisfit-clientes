# Gymnisfit Clientes

Aplicación web de ejemplo para gestionar los clientes (miembros) de un gimnasio. El proyecto contiene un frontend Angular, un backend Node.js + Express, una API REST y persistencia en MongoDB.

## Tecnologías

- Backend: Node.js, Express, MongoDB, Mongoose, CORS, Morgan y dotenv.
- Frontend: Angular 22 standalone, sin SSR ni routing, con Materialize CSS únicamente para estilos.
- Control de versiones: Git.

## Requisitos

- Node.js 24 o superior y npm.
- MongoDB ejecutándose localmente en `127.0.0.1:27017`, o una URI de MongoDB Atlas.

## Instalación y ejecución

### Backend

En PowerShell:

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run dev
```

El archivo `.env` usa por defecto:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/gymnisfit_clientes
```

Para ejecutar sin reinicio automático, usa `npm start`.

### Frontend

En otra terminal:

```powershell
cd frontend
npm install
npx ng serve
```

Abre [http://localhost:4200](http://localhost:4200). El frontend consume la API en `http://localhost:3000/api/clientes`.

## API REST

Base URL: `http://localhost:3000/api/clientes`

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/` | Lista clientes, más recientes primero. |
| GET | `/:id` | Obtiene un cliente por su ID. |
| POST | `/` | Crea un cliente. |
| PUT | `/:id` | Actualiza un cliente. |
| DELETE | `/:id` | Elimina un cliente. |

Ejemplo de cuerpo para `POST` y `PUT`:

```json
{
  "nombre": "Laura Gómez",
  "documento": "1020304050",
  "correo": "laura@ejemplo.com",
  "telefono": "3001234567",
  "plan": "MENSUAL",
  "fechaVencimiento": "2026-12-31"
}
```

Los planes permitidos son `MENSUAL`, `TRIMESTRAL` y `ANUAL`. Cada respuesta de cliente incluye el estado virtual:

- `VENCIDO`: la fecha ya pasó.
- `POR_VENCER`: vence hoy o dentro de los próximos 7 días.
- `ACTIVO`: vence después de los próximos 7 días.

Las validaciones devuelven estado HTTP 400 y un objeto `{ "mensaje": "..." }`. Si el cliente no existe, la API devuelve 404.

## Estructura

```text
backend/
  src/
    index.js
    database.js
    models/Cliente.js
    controllers/clientes.controller.js
    routes/clientes.routes.js
frontend/
  src/
    app/
    gymnisfit-theme.css
    styles.css
```

## Verificación

Desde `frontend/`, el build de producción se ejecuta con:

```powershell
npm run build
```
