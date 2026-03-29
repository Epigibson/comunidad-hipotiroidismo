---
sidebar_position: 2
---

# 🔐 Auth Components

## Login Page

**Archivo**: `src/app/(auth)/login/page.tsx`

Formulario de inicio de sesión con:
- Email + contraseña
- Botón de Google OAuth
- Link a registro
- Manejo de errores con badges
- Estado de loading

## Register Page

**Archivo**: `src/app/(auth)/register/page.tsx`

Formulario de registro con:
- Alias (seudónimo para privacidad)
- Email + contraseña + confirmar contraseña
- Validación de coincidencia de contraseñas
- Estado de éxito (email de confirmación enviado)
- Disclaimer de privacidad médica

## Auth Layout

**Archivo**: `src/app/(auth)/layout.tsx`

Layout compartido para login y registro:
- Centrado vertical y horizontal
- Background con gradientes radiales sutiles
- Logo TiroVida con ícono de mariposa
- Subtítulo "Tu compañera en el camino del hipotiroidismo"
- Card glassmorphism para el formulario

## Auth Callback

**Archivo**: `src/app/auth/callback/route.ts`

Route handler que procesa:
- Callbacks de OAuth (Google)
- Confirmación de email
- Intercambio de código por sesión
- Redirect a dashboard o error
