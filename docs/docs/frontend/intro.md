---
sidebar_position: 1
slug: /frontend/intro
---

# 🎨 Frontend — TiroVida

Documentación técnica del frontend de TiroVida, construido con **Next.js 16** y el design system **Ethereal Sanctuary**.

## Stack

| Tecnología | Uso |
|------------|-----|
| **Next.js 16** | Framework React con App Router |
| **TypeScript** | Type safety |
| **Vanilla CSS** | Design System sin dependencias |
| **Manrope** | Fuente para headlines |
| **Inter** | Fuente para body text |
| **Recharts** | Gráficas de síntomas y labs |
| **jsPDF + html2canvas** | Exportación de reportes PDF |

## Convenciones

- **CSS**: Vanilla CSS con Design Tokens (variables CSS). Sin Tailwind.
- **Componentes**: Cada módulo tiene su propio CSS (BEM naming).
- **Naming**: Archivos en `camelCase`, componentes en `PascalCase`.
- **Data Fetching**: Server Components por defecto. Client solo cuando requiere interactividad.
- **Layouts**: Route groups `(auth)` y `(dashboard)` para layouts paralelos.

## Secciones

- 🎨 [Design System](./design-system/tokens) — Tokens, componentes, glassmorphism
- 📐 [Arquitectura](./architecture/project-structure) — Estructura, routing, data fetching
- 🧩 [Componentes](./components/layout) — Layout, Auth, Dashboard
- 🚀 [Deployment](./deployment) — Vercel y producción
