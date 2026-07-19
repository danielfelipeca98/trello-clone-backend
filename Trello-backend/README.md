# Trello Clone - Backend

API RESTful en tiempo real para el clon de Trello, construida con **Node.js**, **Express**, **Socket.IO** y **MongoDB Atlas**. Gestiona autenticación, tableros, listas, tareas, comentarios y actualizaciones en tiempo real.

---

## Demo en Vivo

**Frontend:** [https://trello-clone-frontend-ki2y.onrender.com](https://trello-clone-frontend-ki2y.onrender.com)

**Credenciales de prueba:**
- **Email:** `demo@email.com`
- **Contraseña:** `123456`

---

## Características

- **Autenticación JWT** (Registro / Login / Logout)
- **Gestión de tableros, listas y tareas** (CRUD completo)
- **WebSockets** para actualizaciones en tiempo real
- **Comentarios** en tiempo real
- **Asignación de tareas** a usuarios
- **Calendario** de tareas con fecha límite
- **Seguridad** con middleware de autenticación
- **CORS** configurado para producción
- **Desplegado en Render** con MongoDB Atlas

---

## Tecnologías

| Tecnología | Propósito |
|------------|-----------|
| **Node.js 20** | Entorno de ejecución |
| **Express.js** | Framework web |
| **Socket.IO** | Comunicación en tiempo real |
| **MongoDB Atlas** | Base de datos en la nube |
| **Mongoose** | ODM para MongoDB |
| **JWT** | Autenticación |
| **Cookie Parser** | Manejo de cookies |
| **CORS** | Política de origen cruzado |

---

##  Estructura del Proyecto

trello-backend/
├── config/
│   └── database.js
├── middleware/
│   └── auth.middleware.js
├── models/
│   ├── board.model.js
│   ├── list.model.js
│   ├── task.model.js
│   ├── comment.model.js
│   └── user.model.js
├── routes/
│   ├── auth.router.js
│   ├── task.router.js
│   ├── board.router.js
│   ├── list.router.js
│   └── comment.router.js
├── server.js
├── package.json
└── README.md


---

## Instalación Local

### Requisitos previos

- **Node.js 20+** → [Descargar](https://nodejs.org/)
- **MongoDB Atlas** → [Crear cuenta gratuita](https://www.mongodb.com/cloud/atlas)
- **Git** → [Descargar](https://git-scm.com/)

### 1. Clonar el repositorio

```bash
git clone https://github.com/danielfelipeca98/trello-clone-backend.git
cd trello-clone-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

```env
PORT=8080
MONGO_URL=mongodb+srv://dfcastrorodriguez_db_user:n14T0Gq9W1hPJKDl@clusterdaniel.gwqqyqq.mongodb.net/Trello_clone?appName=ClusterDaniel
JWT_SECRET=Dfc98122803180
FRONTEND_URL=https://trello-clone-frontend-ki2y.onrender.com
```

### 4. Iniciar el servidor

```bash
npm run dev
```

### 5. Verificar

- **API:** [http://localhost:8080](http://localhost:8080)
- **Health Check:** [http://localhost:8080/health](http://localhost:8080/health)

---

## API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Registrar usuario |
| `POST` | `/api/auth/login` | Iniciar sesión |
| `GET` | `/api/auth/profile` | Obtener perfil del usuario autenticado |
| `GET` | `/api/tasks/list/:listId` | Obtener todas las tareas de una lista |
| `GET` | `/api/tasks/:id` | Obtener una tarea por ID |
| `POST` | `/api/tasks` | Crear una nueva tarea |
| `PUT` | `/api/tasks/:id` | Actualizar una tarea |
| `DELETE` | `/api/tasks/:id` | Eliminar una tarea |
| `GET` | `/api/comments/task/:taskId` | Obtener comentarios de una tarea |
| `POST` | `/api/comments` | Crear un comentario |

---

## WebSockets

| Evento | Descripción |
|--------|-------------|
| `new-task` | Crear una nueva tarea |
| `update-task` | Actualizar una tarea |
| `delete-task` | Eliminar una tarea |
| `new-comment` | Crear un comentario |

---

## Despliegue en Render

### 1. Crear cuenta en [Render](https://render.com)

### 2. Conectar repositorio de GitHub

### 3. Crear Web Service:

| Campo | Valor |
|-------|-------|
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### 4. Variables de entorno:

| Variable | Descripción |
|----------|-------------|
| `PORT` | `8080` |
| `MONGODB_URI` | URL de conexión a MongoDB Atlas |
| `JWT_SECRET` | Clave secreta para JWT |
| `FRONTEND_URL` | URL del frontend (CORS) |

### 5. Desplegar

Render construirá y desplegará automáticamente tu backend.

---

## Pruebas

| Prueba | Estado |
|--------|--------|
| Registro de usuario | OK |
| Login | OK |
| Crear tarea | OK |
| Editar tarea | OK |
| Eliminar tarea | OK |
| Comentarios en tiempo real | OK |
| WebSockets | OK |

---

## Solución de problemas comunes

| Problema | Solución |
|----------|----------|
| **Error 401 Unauthorized** | Verificar que el token se está enviando en el header `Authorization: Bearer <token>` |
| **CORS bloquea peticiones** | Configurar `FRONTEND_URL` en las variables de entorno |
| **MongoDB no conecta** | Verificar que `MONGODB_URI` es correcta y que las IPs están permitidas en Atlas |
| **WebSocket no conecta** | Asegurar que `VITE_API_URL` usa `https://` en producción |

---

## Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## Contacto

**Daniel Felipe Castro**  
GitHub: [danielfelipeca98](https://github.com/danielfelipeca98)

---
- **Backend:** [https://github.com/danielfelipeca98/trello-clone-backend](https://github.com/danielfelipeca98/trello-clone-backend)
- **Frontend:** [https://github.com/danielfelipeca98/trello-clone-frontend](https://github.com/danielfelipeca98/trello-clone-frontend)