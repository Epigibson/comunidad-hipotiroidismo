---
sidebar_position: 5
---

# 🔧 Variables de Entorno

## Archivo `.env.local`

```bash
# Supabase - TiroVida Project
NEXT_PUBLIC_SUPABASE_URL=https://jdndcaokvcggxxxgtmei.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxx
```

## Variables requeridas

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Pública | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Pública | Anon key (publishable) |

:::info Prefijo `NEXT_PUBLIC_`
Las variables con este prefijo son accesibles desde el browser. Son seguras porque RLS protege los datos — la anon key solo permite acceso a lo que las políticas RLS permiten.
:::

## Obtener las keys

```bash
# Listar API keys del proyecto
npx supabase projects api-keys --project-ref jdndcaokvcggxxxgtmei
```

## Variables opcionales (futuro)

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Secreta | Admin key (bypass RLS) — Solo server |
| `GOOGLE_CLIENT_ID` | Secreta | OAuth Google |
| `GOOGLE_CLIENT_SECRET` | Secreta | OAuth Google |

:::danger Service Role Key
NUNCA expongas la `SERVICE_ROLE_KEY` al browser. Solo úsala en Server Actions o Route Handlers.
:::
