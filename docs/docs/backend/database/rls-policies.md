---
sidebar_position: 2
---

# 🔒 Políticas RLS (Row Level Security)

Todas las tablas tienen RLS habilitado. **Ningún dato es accesible sin autenticación** y cada query se filtra automáticamente por el `auth.uid()` del usuario.

## Filosofía de Seguridad

```
🔴 Datos de SALUD   → Solo el propietario (zero-share)
🟡 Perfil PÚBLICO    → Lectura para autenticados (alias/avatar)
🟢 Comunidad         → CRUD con ownership, lectura pública para autenticados
```

---

## Profiles

| Política | Operación | Regla |
|----------|-----------|-------|
| Users can view own profile | `SELECT` | `auth.uid() = id` |
| Users can update own profile | `UPDATE` | `auth.uid() = id` |
| Users can insert own profile | `INSERT` | `auth.uid() = id` |
| Authenticated can view public profiles | `SELECT` | `auth.role() = 'authenticated'` |

:::info Perfiles públicos
La última política permite que otros usuarios autenticados vean datos básicos como alias y avatar en el contexto de la comunidad. Los datos sensibles (nombre real, año de nacimiento) solo se muestran al propietario.
:::

## Health Conditions — 🔴 Estrictamente Privado

| Política | Operación | Regla |
|----------|-----------|-------|
| Users can CRUD own conditions | `ALL` | `auth.uid() = user_id` |

:::danger Zero-share
Los datos de condiciones de salud NUNCA son visibles para otros usuarios, ni siquiera moderadores. Solo el propietario y la base de datos los pueden acceder.
:::

## Daily Logs — 🔴 Estrictamente Privado

| Política | Operación | Regla |
|----------|-----------|-------|
| Users can CRUD own logs | `ALL` | `auth.uid() = user_id` |

## Lab Results — 🔴 Estrictamente Privado

| Política | Operación | Regla |
|----------|-----------|-------|
| Users can CRUD own labs | `ALL` | `auth.uid() = user_id` |

## Community Categories — 🟢 Lectura pública

| Política | Operación | Regla |
|----------|-----------|-------|
| Authenticated can view categories | `SELECT` | `auth.role() = 'authenticated'` |

:::tip Solo lectura
Las categorías son administradas directamente en la base de datos por los admins. Los usuarios solo las leen.
:::

## Community Threads — 🟢 CRUD con ownership

| Política | Operación | Regla |
|----------|-----------|-------|
| Authenticated can view threads | `SELECT` | `auth.role() = 'authenticated'` |
| Authenticated can create threads | `INSERT` | `auth.uid() = author_id` |
| Authors can update own threads | `UPDATE` | `auth.uid() = author_id` |

## Community Replies — 🟢 CRUD con ownership

| Política | Operación | Regla |
|----------|-----------|-------|
| Authenticated can view replies | `SELECT` | `auth.role() = 'authenticated'` |
| Authenticated can create replies | `INSERT` | `auth.uid() = author_id` |
| Authors can update own replies | `UPDATE` | `auth.uid() = author_id` |

## Buddy Matches — 🟡 Participants only

| Política | Operación | Regla |
|----------|-----------|-------|
| Users can view own matches | `SELECT` | `auth.uid() = user_a OR auth.uid() = user_b` |
| Users can create matches | `INSERT` | `auth.uid() = user_a` |
| Users can update own matches | `UPDATE` | `auth.uid() = user_a OR auth.uid() = user_b` |

---

## Testing de RLS

Para verificar que las políticas funcionan correctamente, puedes usar el SQL Editor de Supabase:

```sql
-- Simular un usuario específico
SET request.jwt.claims = '{"sub": "user-uuid-here", "role": "authenticated"}';

-- Intentar leer datos de otro usuario (debería retornar vacío)
SELECT * FROM daily_logs WHERE user_id = 'otro-usuario-uuid';
-- Resultado: 0 rows ✅
```
