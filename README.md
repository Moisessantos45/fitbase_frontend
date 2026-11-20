# Fitbase — Frontend Web (Nuxt)

Aplicación web de **Fitbase**: plataforma de gestión de gimnasios, membresías, pases diarios y control de accesos. Este repositorio contiene el frontend **Nuxt 4 (SPA)** que consume la API REST y sirve a los roles **Dueño**, **Encargado** y **Cliente**, además del flujo público de invitados (*guest*).

## Repos relacionados

| Proyecto | Tecnología | Repositorio |
| :--- | :--- | :--- |
| Backend API (principal) | Go (Gin + GORM + PostgreSQL + Redis) | [Moisessantos45/fitbase_backend](https://github.com/Moisessantos45/fitbase_backend) |
| Backend API (alternativo) | PHP | [Moisessantos45/fitbase_backend_php](https://github.com/Moisessantos45/fitbase_backend_php) |
| Versión móvil | App móvil | [Moisessantos45/fitbase](https://github.com/Moisessantos45/fitbase) |
| Frontend web (este repo) | Nuxt 4 / Vue 3 | [Moisessantos45/fitbase_frontend](https://github.com/Moisessantos45/fitbase_frontend) |

## ✨ Funcionalidades

- **Auth**: registro (cliente / dueño), login, 2FA/TOTP, confirmación de correo, recuperación de contraseña y sesiones web vs. móvil (tokens PASETO v2 + refresh tokens).
- **Cliente**: mapa interactivo de sedes (Leaflet/PostGIS), detalle de gimnasios, catálogo de planes, compra de pases diarios y suscripciones, credencial QR de acceso, historial de pagos y visitas.
- **Dueño**: alta de sedes con horarios y galería, gestión de planes y beneficios, encargados, control de caja, reportes de ingresos, analítica y dashboard (ApexCharts).
- **Encargado**: apertura/cierre de turno de caja, validación QR de check-in, registro de visitantes casuales y cobro en mostrador.
- **Invitado (*guest*)**: compra de pase de un día sin cuenta y consulta/impresión de ticket QR.

## 🛠 Stack

- **Nuxt 4** (SSR deshabilitado → SPA) + **Vue 3** + TypeScript
- **Pinia** (estado) · **Tailwind CSS v4** · **Leaflet** (mapas) · **ApexCharts** (analytics)
- **Axios** + capa de servicios (`app/services`) con manejo de errores y resultados tipados
- **Biome** (lint/format)

## 📁 Estructura

```
app/
├── pages/            # Rutas por rol: (public), (auth), (user), (manager), (admin)
├── layouts/          # default | auth | admin | user
├── components/       # atoms → molecules → organisms → templates → features
├── store/            # Stores Pinia (auth, gym, plan, subscription, payment, checkin, analytics…)
├── entities/         # Tipos/DTOs de dominio
├── services/         # Cliente API (api.ts), errorHandler, result
├── helpers/mappers/  # Mappers DTO ↔ UI y formatters
├── composables/      # useData, useUploadFile, useApiResult, useCredentialDownload…
├── middleware/       # auth.global.ts (guardián de rutas por rol)
└── assets/css/       # Estilos globales (Tailwind)
```

## 🚀 Puesta en marcha

```bash
# Instalar dependencias (bun recomendado; también npm/pnpm/yarn)
bun install

# Servidor de desarrollo en http://localhost:3000
bun run dev

# Build y preview de producción
bun run build
bun run preview
```

### Variables de entorno (`.env`)

| Variable | Descripción | Por defecto |
| :--- | :--- | :--- |
| `NUXT_PUBLIC_API_BASE` | Base URL de la API | `http://localhost:4107/api/v1` |
| `NUXT_PUBLIC_API_AUTH_BASE` | Base URL de auth | `http://localhost:4107/api/v1` |

## 📚 Documentación (`docs/`)

El directorio `docs/` comparte la documentación técnica del proyecto:

| Documento | Contenido |
| :--- | :--- |
| [plan_implementacion.md](docs/plan_implementacion.md) | Hoja de ruta por fases de la API |
| [project_structure.md](docs/project_structure.md) | Arquitectura y capas del backend |
| [features/*/README.md](docs/features) | Especificación por módulo (auth, user, gym, plan, subscription, daypass, payment, checkin, manager, owner, analytics) |
| [tasks/](docs/tasks) | Tareas por rol, completadas y orden cronológico recomendado |
| [tasks_team/](docs/tasks_team) | Flujos de UI por actor (dueño, encargado, cliente) |
| [seguridad_api.md](docs/seguridad_api.md) · [owasp_top_10_2025.md](docs/owasp_top_10_2025.md) | Checklist de seguridad y OWASP Top 10:2025 |
| [recomendaciones_gorm.md](docs/recomendaciones_gorm.md) | Buenas prácticas GORM |
| [ui_desing.md](docs/ui_desing.md) | Design system (dark sport, verde neón `#D2F801`) |
| [implements/auth_sesiones_movil_web.md](docs/implements/auth_sesiones_movil_web.md) | Sesiones multiplataforma (web/móvil) en Redis |

## 📄 Licencia

Ver [LICENSE](./LICENSE).
