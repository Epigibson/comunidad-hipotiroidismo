---
sidebar_position: 3
---

# ✨ Glassmorphism

Glassmorphism es un efecto clave del design system Ethereal Sanctuary que le da profundidad y elegancia a la interfaz.

## Tokens

```css
--glass-bg: rgba(255, 255, 255, 0.7);
--glass-blur: blur(20px);
--glass-border: rgba(255, 255, 255, 0.3);
```

## Uso

```css
.mi-elemento {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-2xl);
}
```

## Dónde se usa

| Componente | Descripción |
|------------|-------------|
| **Navbar** | Barra de navegación superior (landing + dashboard) |
| **Bottom Nav** | Navegación inferior mobile |
| **Auth Card** | Tarjeta del formulario de login/registro |
| **Modales** | Diálogos y overlays |

## Consideraciones

:::warning Performance en móviles
`backdrop-filter` puede afectar el rendimiento en dispositivos de gama baja. Siempre incluye `-webkit-backdrop-filter` para Safari.
:::

:::tip Accesibilidad
Asegúrate de que el contraste del texto sobre fondos glassmorphism sea suficiente (WCAG AA mínimo 4.5:1).
:::
