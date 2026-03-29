---
sidebar_position: 3
---

# 🔄 Gestión de Sesiones

## Estrategia

TiroVida utiliza **cookie-based sessions** manejadas por `@supabase/ssr`.

## proxy.ts (antes middleware.ts)

:::info Next.js 16
En Next.js 16, `middleware.ts` fue renombrado a `proxy.ts`. La funcionalidad es idéntica.
:::

```typescript
// src/proxy.ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

## Función updateSession

```typescript
// src/lib/supabase/middleware.ts
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Redirect unauthenticated users to login
  const protectedPaths = ["/dashboard", "/tracker", "/labs", "/reports", "/community", "/profile", "/buddy"];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

### Lo que hace en cada request:

1. Crea un cliente Supabase con acceso a las cookies
2. Llama `getUser()` para verificar/refrescar el JWT
3. Si la ruta es protegida y no hay usuario → redirect a `/login`
4. Propaga las cookies actualizadas en la respuesta
