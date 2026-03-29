---
sidebar_position: 4
---

# 📂 Categorías de Comunidad

## Categorías actuales (12)

| # | Nombre | Slug | Ícono | ⚠️ Trigger Warning |
|---|--------|------|-------|---------------------|
| 1 | General | `general` | 💬 | No |
| 2 | Síntomas y Experiencias | `sintomas` | 🩺 | No |
| 3 | Medicación | `medicacion` | 💊 | No |
| 4 | Laboratorios | `laboratorios` | 🔬 | No |
| 5 | Nutrición | `nutricion` | 🥗 | No |
| 6 | Ejercicio y Bienestar | `ejercicio` | 🧘 | No |
| 7 | Hashimoto | `hashimoto` | 🦋 | No |
| 8 | SOP y Tiroides | `sop` | 🌸 | No |
| 9 | Embarazo y Fertilidad | `embarazo` | 🤰 | ⚠️ Sí |
| 10 | Salud Mental | `salud-mental` | 🧠 | ⚠️ Sí |
| 11 | Logros y Celebraciones | `logros` | 🎉 | No |
| 12 | Recursos | `recursos` | 📚 | No |

## Agregar una nueva categoría

```sql
INSERT INTO community_categories (name, slug, description, icon, has_trigger_warning, trigger_warning_text, sort_order)
VALUES (
  'Nueva Categoría',
  'nueva-categoria',
  'Descripción de la categoría',
  '🆕',
  false,
  null,
  13  -- siguiente número en sort_order
);
```

## Editar una categoría

```sql
UPDATE community_categories
SET name = 'Nuevo Nombre',
    description = 'Nueva descripción'
WHERE slug = 'slug-existente';
```

## Reordenar categorías

```sql
UPDATE community_categories SET sort_order = 1 WHERE slug = 'general';
UPDATE community_categories SET sort_order = 2 WHERE slug = 'sintomas';
-- ... etc
```

:::tip Slugs únicos
El slug debe ser único y usar solo minúsculas, números y guiones. Se usa en las URLs.
:::
