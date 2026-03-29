---
sidebar_position: 1
---

# 🏗️ Layout Components

## DashboardNav

Componente de navegación superior del dashboard.

**Archivo**: `src/components/layout/DashboardNav.tsx`

```typescript
interface DashboardNavProps {
  user: {
    alias: string;
    avatarUrl: string | null;
    role: string;
  };
}
```

**Características:**
- Logo con branding TiroVida 🦋
- Saludo personalizado con alias del usuario
- Avatar circular con fallback a inicial
- Botón de cerrar sesión
- Glassmorphism background con blur

## BottomNav

Navegación inferior para dispositivos móviles.

**Archivo**: `src/components/layout/BottomNav.tsx`

| Ícono | Label | Ruta | Descripción |
|-------|-------|------|-------------|
| 🏠 | Inicio | `/dashboard` | Panel principal |
| 📝 | Registrar | `/tracker` | Registro diario |
| 🔬 | Labs | `/labs` | Laboratorios |
| 💬 | Comunidad | `/community` | Foros |
| 👤 | Perfil | `/profile` | Configuración |

**Comportamiento:**
- Se oculta en pantallas > 768px (desktop)
- Resalta el item activo basado en `usePathname()`
- Safe area padding para notch de iOS
