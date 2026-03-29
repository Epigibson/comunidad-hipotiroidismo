---
sidebar_position: 2
---

# 📡 Endpoints y Queries

TiroVida no tiene una API REST tradicional. Todos los datos se acceden directamente desde Supabase usando RLS.

## Queries principales

### Obtener perfil del usuario

```typescript
const { data: profile } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .single();
```

### Obtener log de hoy

```typescript
const today = new Date().toISOString().split("T")[0];
const { data: todayLog } = await supabase
  .from("daily_logs")
  .select("*")
  .eq("user_id", user.id)
  .eq("log_date", today)
  .maybeSingle();
```

### Registrar síntomas del día

```typescript
const { error } = await supabase
  .from("daily_logs")
  .upsert({
    user_id: user.id,
    log_date: today,
    energy_level: 3,
    brain_fog_level: 2,
    mood_level: 4,
    joint_pain_level: 1,
    medication_taken: true,
    medication_dose_mcg: 75,
  });
```

### Obtener historial de laboratorios

```typescript
const { data: labs } = await supabase
  .from("lab_results")
  .select("*")
  .eq("user_id", user.id)
  .order("test_date", { ascending: false });
```

### Obtener hilos de una categoría

```typescript
const { data: threads } = await supabase
  .from("community_threads")
  .select(`
    *,
    author:profiles(alias, avatar_url),
    category:community_categories(name, slug)
  `)
  .eq("category_id", categoryId)
  .order("created_at", { ascending: false });
```

### Calcular racha de registros

```typescript
const { data: recentLogs } = await supabase
  .from("daily_logs")
  .select("log_date")
  .eq("user_id", user.id)
  .order("log_date", { ascending: false })
  .limit(30);
```

## Route Handlers

| Ruta | Método | Propósito |
|------|--------|-----------|
| `/auth/callback` | `GET` | OAuth/email callback |

:::tip Sin API custom
Gracias a RLS, no necesitamos crear endpoints custom. Supabase maneja la autorización automáticamente en cada query.
:::
