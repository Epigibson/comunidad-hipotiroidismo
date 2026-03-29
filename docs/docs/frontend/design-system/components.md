---
sidebar_position: 2
---

# 🧩 Componentes CSS

El design system incluye componentes CSS reutilizables definidos en `globals.css`.

## Botones

```html
<button class="btn btn--primary">Primario</button>
<button class="btn btn--outline">Outline</button>
<button class="btn btn--ghost">Ghost</button>
<button class="btn btn--primary btn--sm">Pequeño</button>
<button class="btn btn--primary btn--lg">Grande</button>
```

| Clase | Descripción |
|-------|-------------|
| `.btn` | Estilos base |
| `.btn--primary` | Fondo primary, texto blanco |
| `.btn--outline` | Borde primary, fondo transparente |
| `.btn--ghost` | Sin borde ni fondo, solo texto |
| `.btn--sm` | Padding reducido |
| `.btn--lg` | Padding amplio |

## Inputs

```html
<div class="input-group">
  <label class="input-label">Email</label>
  <input class="input" type="email" />
  <span class="input-helper">Texto de ayuda</span>
</div>
```

## Cards

```html
<div class="card">
  Contenido de la card
</div>
```

## Badges

```html
<span class="badge badge--primary">Primario</span>
<span class="badge badge--success">Éxito</span>
<span class="badge badge--warning">Aviso</span>
<span class="badge badge--error">Error</span>
```

## Avatar

```html
<div class="avatar avatar--sm">A</div>
<div class="avatar avatar--md">
  <img src="url" alt="name" />
</div>
<div class="avatar avatar--lg">C</div>
```

## Container

```html
<div class="container">
  Contenido centrado con max-width
</div>
```

## Utilidades

```html
<p class="text-muted">Texto atenuado</p>
<p class="text-center">Centrado</p>
<div class="flex items-center justify-between">Flex layout</div>
```
