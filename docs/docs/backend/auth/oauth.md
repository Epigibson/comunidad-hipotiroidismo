---
sidebar_position: 2
---

# 🌐 OAuth (Google)

## Configuración

Para habilitar Google OAuth en Supabase:

1. Ve al [Dashboard de Supabase](https://supabase.com/dashboard/project/jdndcaokvcggxxxgtmei/auth/providers)
2. Activa el provider **Google**
3. Configura las credenciales de Google Cloud Console

### Google Cloud Console

1. Crea un proyecto en [console.cloud.google.com](https://console.cloud.google.com)
2. Navega a **APIs & Services > Credentials**
3. Crea un **OAuth 2.0 Client ID**
4. Configura las URIs de redirección:
   - `https://jdndcaokvcggxxxgtmei.supabase.co/auth/v1/callback`
5. Copia el `Client ID` y `Client Secret` al dashboard de Supabase

## Implementación en el frontend

```typescript
async function handleOAuth(provider: "google") {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}
```

## Callback handler

```typescript
// src/app/auth/callback/route.ts
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
```
