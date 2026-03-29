---
sidebar_position: 1
---

# 🔐 Autenticación — Overview

TiroVida utiliza **Supabase Auth** para manejar la autenticación de usuarios.

## Métodos disponibles

| Método | Estado | Descripción |
|--------|--------|-------------|
| Email/Password | ✅ Activo | Registro con confirmación por email |
| Google OAuth | ✅ Activo | Login con cuenta de Google |

## Flujo de autenticación

```
Usuario                    Next.js                    Supabase Auth
  │                          │                             │
  │── Llena formulario ──────▶                             │
  │                          │── signInWithPassword() ────▶│
  │                          │                             │
  │                          │◀── JWT + Refresh Token ─────│
  │                          │                             │
  │                          │── setCookie(session) ──▶ Browser
  │                          │                             │
  │◀── Redirect /dashboard ──│                             │
```

## Archivos clave

| Archivo | Propósito |
|---------|-----------|
| `src/app/(auth)/login/page.tsx` | Formulario de login |
| `src/app/(auth)/register/page.tsx` | Formulario de registro |
| `src/app/auth/callback/route.ts` | Callback para OAuth + email confirm |
| `src/lib/supabase/client.ts` | Cliente Supabase (browser) |
| `src/lib/supabase/server.ts` | Cliente Supabase (server) |
| `src/lib/supabase/middleware.ts` | Lógica de refresco de sesión |
| `src/proxy.ts` | Entry point del proxy (Next.js 16) |

## Registro (Sign Up)

1. Usuario llena: alias, email, contraseña, confirmar contraseña
2. Se llama `supabase.auth.signUp()` con `emailRedirectTo`
3. El alias se almacena en `raw_user_meta_data`
4. Supabase envía email de confirmación
5. Al confirmar, el trigger `on_auth_user_created` crea el perfil
6. El callback (`/auth/callback`) intercambia el código por sesión

## Login

1. `supabase.auth.signInWithPassword()` o `signInWithOAuth()`
2. Se recibe JWT + refresh token
3. La cookie de sesión se establece automáticamente via `@supabase/ssr`
4. `proxy.ts` refresca la sesión en cada request

## Protección de rutas

El `proxy.ts` intercepta todas las requests y refresca la sesión. El Dashboard layout verifica `supabase.auth.getUser()` y redirige a `/login` si no hay sesión.

```typescript
// src/app/(dashboard)/layout.tsx
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect("/login");
```
