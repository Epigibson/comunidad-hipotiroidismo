---
sidebar_position: 2
---

# 🗺️ Routing

TiroVida usa el **App Router** de Next.js 16.

## Mapa de rutas

| Ruta | Tipo | Auth | Layout | Descripción |
|------|------|------|--------|-------------|
| `/` | Static | ❌ | Root | Landing page |
| `/login` | Static | ❌ | Auth | Formulario de login |
| `/register` | Static | ❌ | Auth | Formulario de registro |
| `/auth/callback` | Dynamic | ❌ | — | OAuth/email callback |
| `/dashboard` | Dynamic | ✅ | Dashboard | Panel principal |
| `/tracker` | Dynamic | ✅ | Dashboard | Registro de síntomas |
| `/labs` | Dynamic | ✅ | Dashboard | Laboratorios |
| `/reports` | Dynamic | ✅ | Dashboard | Reportes clínicos |
| `/community` | Dynamic | ✅ | Dashboard | Foros comunitarios |
| `/profile` | Dynamic | ✅ | Dashboard | Perfil de usuario |

## Protección de rutas

La protección se implementa en **dos niveles**:

### 1. Proxy (proxy.ts)
Intercepta TODAS las requests y redirige a `/login` si la ruta es protegida y no hay sesión.

### 2. Layout del Dashboard
El layout de `(dashboard)` hace `getUser()` y llama `redirect("/login")` si no hay usuario. Esto es una segunda capa de seguridad.

```
Request → proxy.ts (check session) → Dashboard Layout (check user) → Page
```
