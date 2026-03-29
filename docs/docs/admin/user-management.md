---
sidebar_position: 2
---

# 👥 Gestión de Usuarios

## Ver usuarios

Desde el **Dashboard de Supabase** → Authentication → Users.

[Abrir Users](https://supabase.com/dashboard/project/jdndcaokvcggxxxgtmei/auth/users)

## Cambiar rol de un usuario

```sql
-- Desde el SQL Editor de Supabase
UPDATE profiles
SET role = 'moderator'
WHERE id = 'user-uuid-here';
```

### Roles disponibles

| Rol | Asignar cuando... |
|-----|-------------------|
| `patient` | Usuario estándar (default) |
| `family` | Familiar o cuidador de paciente |
| `moderator` | Persona de confianza para moderar comunidad |
| `specialist` | Endocrinólogo u otro profesional verificado |

## Verificar a un especialista

```sql
UPDATE profiles
SET is_verified_specialist = true,
    role = 'specialist'
WHERE id = 'specialist-uuid-here';
```

:::warning Verificación manual
La verificación de especialistas debe hacerse manualmente revisando las credenciales profesionales del usuario.
:::

## Suspender un usuario

Para suspender un usuario, usa el Dashboard de Supabase:

1. Ve a **Authentication → Users**
2. Busca al usuario
3. Haz clic en los 3 puntos → **Ban user**

Esto revoca todos sus tokens y le impide iniciar sesión.
