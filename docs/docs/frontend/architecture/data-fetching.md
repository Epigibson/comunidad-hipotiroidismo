---
sidebar_position: 3
---

# 📡 Data Fetching

TiroVida usa el patrón **Server-first** de Next.js 16.

## Estrategia

| Tipo de datos | Método | Razón |
|---------------|--------|-------|
| Datos de salud | Server Component | Privacidad, nunca expuesto al bundle |
| Perfil de usuario | Server Component | Carga inicial, SEO |
| Formularios | Client Component | Interactividad, validación |
| Autenticación | Client Component | Estado reactivo |

## Ejemplo: Server Component (Dashboard)

```typescript
// App(dashboard)/dashboard/page.tsx — Server Component
export default async function DashboardPage() {
  const supabase = await createClient(); // Server client
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Datos sensibles obtenidos en el server
  const { data: todayLog } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("log_date", today)
    .maybeSingle();

  return <div>{/* Render with data */}</div>;
}
```

## Ejemplo: Client Component (Login)

```typescript
"use client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    const supabase = createClient(); // Browser client
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    // ...
  }

  return <form onSubmit={handleLogin}>{/* Form fields */}</form>;
}
```

## Type Safety con Supabase

```typescript
// Casting explícito para resolver inferencia de tipos
const { data: profile } = (await supabase
  .from("profiles")
  .select("alias")
  .eq("id", user.id)
  .single()) as { data: Pick<Profile, "alias"> | null };
```

:::tip Por qué el casting
Los tipos manuales de `Database` pueden no coincidir perfectamente con la inferencia de `@supabase/ssr`. El casting explícito garantiza type-safety en el desarrollo.
:::
