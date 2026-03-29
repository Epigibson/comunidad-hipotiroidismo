---
sidebar_position: 4
---

# 🔄 Migraciones

TiroVida usa la CLI de Supabase para gestionar migraciones de base de datos.

## Estructura

```
supabase/
└── migrations/
    └── 20260328_init_schema.sql    ← Esquema inicial completo
```

## Archivo de migración inicial

El archivo `20260328_init_schema.sql` contiene:

1. **8 tablas** — profiles, health_conditions, daily_logs, lab_results, community_categories, community_threads, community_replies, buddy_matches
2. **7 indexes** — Optimizados para los queries más frecuentes
3. **RLS completo** — Políticas para todas las tablas
4. **2 funciones** — `handle_new_user()` y `update_updated_at()`
5. **6 triggers** — Auto-crear perfil + 5 auto-update timestamps
6. **12 categorías seed** — Datos iniciales para la comunidad

## Comandos útiles

### Aplicar migraciones al proyecto remoto

```bash
npx supabase db push
```

### Ver estado de migraciones

```bash
npx supabase migration list
```

### Crear nueva migración

```bash
npx supabase migration new nombre_descriptivo
```

Esto crea un archivo en `supabase/migrations/` con timestamp. Escribe tu SQL y luego ejecuta `db push`.

### Generar tipos TypeScript

```bash
npx supabase gen types typescript --project-id jdndcaokvcggxxxgtmei > src/lib/types/database.ts
```

:::tip Regenerar tipos después de cada migración
Cada vez que modifiques el esquema, regenera los tipos para mantener la type-safety.
:::

## Rollback

Supabase no tiene rollback automático. Para revertir:

1. Crea una nueva migración con los cambios inversos
2. Aplica con `npx supabase db push`

:::danger Producción
Siempre haz backup antes de ejecutar migraciones en producción.
:::
