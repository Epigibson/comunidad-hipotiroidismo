---
sidebar_position: 3
---

# 📊 Dashboard Components

## Dashboard Page

**Archivo**: `src/app/(dashboard)/dashboard/page.tsx`

Server Component que muestra el panel principal del usuario.

### Datos que carga (server-side)

| Dato | Query | Visualización |
|------|-------|---------------|
| Log de hoy | `daily_logs` WHERE `log_date = today` | Energía actual |
| Racha | Últimos 30 `daily_logs` ordenados | Días consecutivos |
| Último TSH | `lab_results` ORDER BY `test_date` LIMIT 1 | Valor + fecha |
| Perfil | `profiles` WHERE `id = user.id` | Alias para saludo |

### Stat Cards

Tres tarjetas con:
1. 🔥 **Racha** — Días consecutivos registrando
2. ⚡ **Energía hoy** — Nivel 1-5 con emoji
3. 🔬 **Último TSH** — Valor en mUI/L + fecha

### Quick Actions

Grid de 4 acciones rápidas:
- 📝 Registrar/Editar síntomas de hoy
- 🔬 Agregar resultado de laboratorio
- 💬 Ir a la comunidad
- 📊 Ver reportes

### Función calculateStreak

```typescript
function calculateStreak(dates: string[]): number {
  // Itera desde hoy hacia atrás
  // Cuenta días consecutivos con log
  // Se detiene en la primera brecha
}
```
