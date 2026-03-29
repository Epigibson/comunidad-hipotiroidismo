---
sidebar_position: 3
---

# ⚡ Triggers y Funciones

TiroVida utiliza triggers de PostgreSQL para automatizar tareas comunes.

## 1. Auto-crear perfil al registrarse

Cuando un usuario se registra en Supabase Auth, se crea automáticamente un registro en `profiles`.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, alias, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'alias', 'Anónimo'),
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### ¿Cómo funciona?

1. El usuario se registra (vía email/password o OAuth)
2. Supabase inserta un row en `auth.users`
3. El trigger `on_auth_user_created` se dispara
4. La función `handle_new_user()` crea el perfil con:
   - `id` = el mismo UUID de auth
   - `alias` = lo que escribió en el formulario de registro, o "Anónimo"
   - `full_name` = si lo proporcionó

:::warning SECURITY DEFINER
La función usa `SECURITY DEFINER` porque se ejecuta en el contexto de `auth.users`, una tabla del sistema a la que los usuarios normales no tienen acceso.
:::

---

## 2. Auto-actualizar `updated_at`

Cada tabla que tiene columna `updated_at` tiene un trigger que la actualiza automáticamente.

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Tablas con este trigger

| Tabla | Trigger Name |
|-------|-------------|
| `profiles` | `set_updated_at_profiles` |
| `daily_logs` | `set_updated_at_daily_logs` |
| `community_threads` | `set_updated_at_community_threads` |
| `community_replies` | `set_updated_at_community_replies` |
| `buddy_matches` | `set_updated_at_buddy_matches` |

Ejemplo de creación:

```sql
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```
