---
sidebar_position: 1
---

# 🌐 Clientes Supabase

TiroVida utiliza dos clientes de Supabase: uno para el **browser** y otro para el **server**.

## Cliente Browser

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Cuándo usarlo
- En componentes con `"use client"`
- Para operaciones de auth (login, logout, signUp)
- Para subscripciones en tiempo real

### Ejemplo de uso
```typescript
"use client";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
const { data, error } = await supabase
  .from("daily_logs")
  .select("*")
  .eq("user_id", userId);
```

---

## Cliente Server

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/types/database";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

### Cuándo usarlo
- En **Server Components** (sin `"use client"`)
- En **Route Handlers** (`route.ts`)
- En **Server Actions**

### Ejemplo de uso
```typescript
// Server Component
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // ...
}
```

---

## Type Safety

Ambos clientes están tipados con `Database` generics, lo que proporciona autocompletado para:
- Nombres de tablas
- Nombres de columnas
- Tipos de retorno de queries

:::warning Tipos manuales
Actualmente los tipos están definidos manualmente en `src/lib/types/database.ts`. Para regenerar desde la base de datos real:

```bash
npx supabase gen types typescript --project-id jdndcaokvcggxxxgtmei > src/lib/types/database.ts
```
:::
