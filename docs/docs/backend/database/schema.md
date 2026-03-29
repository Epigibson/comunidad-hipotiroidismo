---
sidebar_position: 1
---

# 🗄️ Esquema de Base de Datos

TiroVida utiliza PostgreSQL a través de Supabase con 8 tablas principales organizadas en 3 dominios:

## Diagrama Entidad-Relación

```
auth.users (Supabase Auth)
    │
    ▼ 1:1
┌──────────┐      ┌───────────────────┐
│ profiles  │──1:N─▶│ health_conditions │
└─────┬────┘      └───────────────────┘
      │
      ├──1:N──▶ daily_logs
      │
      ├──1:N──▶ lab_results
      │
      ├──1:N──▶ community_threads ──N:1──▶ community_categories
      │             │
      │             ├──1:N──▶ community_replies
      │
      └──N:N──▶ buddy_matches
```

---

## Tablas

### `profiles` — Perfiles de usuario

Extensión de `auth.users`. Se crea automáticamente vía trigger.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id` | `UUID` | ❌ | — | PK, FK → auth.users |
| `alias` | `TEXT` | ✅ | — | Nombre público (seudónimo) |
| `full_name` | `TEXT` | ✅ | — | Nombre real (opcional) |
| `role` | `TEXT` | ✅ | `'patient'` | `patient`, `family`, `moderator`, `specialist` |
| `avatar_url` | `TEXT` | ✅ | — | URL de avatar |
| `is_verified_specialist` | `BOOLEAN` | ✅ | `false` | Verificado por admin |
| `bio` | `TEXT` | ✅ | — | Biografía |
| `birth_year` | `INTEGER` | ✅ | — | Año de nacimiento |
| `created_at` | `TIMESTAMPTZ` | ✅ | `NOW()` | — |
| `updated_at` | `TIMESTAMPTZ` | ✅ | `NOW()` | Auto-actualizado |

---

### `health_conditions` — Condiciones de salud

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id` | `UUID` | ❌ | `gen_random_uuid()` | PK |
| `user_id` | `UUID` | ❌ | — | FK → profiles |
| `condition_name` | `TEXT` | ❌ | — | Nombre de la condición |
| `condition_type` | `TEXT` | ✅ | — | `hypothyroidism`, `hashimoto`, `pcos`, `other` |
| `diagnosis_date` | `DATE` | ✅ | — | Fecha de diagnóstico |
| `notes` | `TEXT` | ✅ | — | Notas adicionales |
| `created_at` | `TIMESTAMPTZ` | ✅ | `NOW()` | — |

---

### `daily_logs` — Registro diario de síntomas

Constraint: **Un log por día por usuario** (`UNIQUE(user_id, log_date)`)

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id` | `UUID` | ❌ | `gen_random_uuid()` | PK |
| `user_id` | `UUID` | ❌ | — | FK → profiles |
| `log_date` | `DATE` | ❌ | `CURRENT_DATE` | Fecha del registro |
| `energy_level` | `INTEGER` | ✅ | — | 1-5 (Likert) |
| `brain_fog_level` | `INTEGER` | ✅ | — | 1-5 (Likert) |
| `mood_level` | `INTEGER` | ✅ | — | 1-5 (Likert) |
| `joint_pain_level` | `INTEGER` | ✅ | — | 1-5 (Likert) |
| `sleep_hours` | `NUMERIC(3,1)` | ✅ | — | Horas de sueño |
| `weight_kg` | `NUMERIC(5,2)` | ✅ | — | Peso en kg |
| `medication_taken` | `BOOLEAN` | ✅ | `false` | ¿Tomó medicación? |
| `medication_dose_mcg` | `NUMERIC(6,2)` | ✅ | — | Dosis en mcg |
| `medication_name` | `TEXT` | ✅ | `'Levotiroxina'` | Nombre del medicamento |
| `custom_notes` | `TEXT` | ✅ | — | Notas libres |
| `created_at` | `TIMESTAMPTZ` | ✅ | `NOW()` | — |
| `updated_at` | `TIMESTAMPTZ` | ✅ | `NOW()` | Auto-actualizado |

#### Escala Likert utilizada

| Nivel | Energía | Niebla Mental | Estado de Ánimo | Dolor Articular |
|-------|---------|---------------|-----------------|-----------------|
| 1 | 🪫 Muy baja | 🧠 Nada | 😢 Muy bajo | ✅ Sin dolor |
| 2 | 😴 Baja | 💭 Leve | 😕 Bajo | 🟡 Leve |
| 3 | 😐 Regular | 🌫️ Moderado | 😐 Neutro | 🟠 Moderado |
| 4 | 😊 Buena | 😶‍🌫️ Alto | 🙂 Bueno | 🔴 Fuerte |
| 5 | ⚡ Excelente | 🌪️ Severo | 😄 Excelente | 🚨 Severo |

---

### `lab_results` — Resultados de laboratorio

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id` | `UUID` | ❌ | `gen_random_uuid()` | PK |
| `user_id` | `UUID` | ❌ | — | FK → profiles |
| `test_date` | `DATE` | ❌ | — | Fecha del estudio |
| `tsh_level` | `NUMERIC(8,4)` | ✅ | — | TSH (mUI/L) |
| `t3_free` | `NUMERIC(8,4)` | ✅ | — | T3 Libre |
| `t4_free` | `NUMERIC(8,4)` | ✅ | — | T4 Libre |
| `t3_total` | `NUMERIC(8,4)` | ✅ | — | T3 Total |
| `t4_total` | `NUMERIC(8,4)` | ✅ | — | T4 Total |
| `anti_tpo` | `NUMERIC(10,2)` | ✅ | — | Anticuerpos Anti-TPO |
| `anti_tg` | `NUMERIC(10,2)` | ✅ | — | Anticuerpos Anti-Tg |
| `lab_name` | `TEXT` | ✅ | — | Nombre del laboratorio |
| `notes` | `TEXT` | ✅ | — | Notas |
| `file_url` | `TEXT` | ✅ | — | URL del archivo PDF |
| `created_at` | `TIMESTAMPTZ` | ✅ | `NOW()` | — |

#### Rangos de referencia TSH

| Rango | Valores (mUI/L) | Interpretación | Color |
|-------|-----------------|----------------|-------|
| Bajo | 0 – 0.4 | Hipertiroidismo o sobredosis | 🟡 Warning |
| Normal | 0.4 – 4.0 | Rango óptimo | 🟢 Success |
| Elevado | 4.0 – 10.0 | Hipotiroidismo subclínico | 🟡 Warning |
| Muy elevado | > 10.0 | Hipotiroidismo clínico | 🔴 Error |

---

### `community_categories` — Categorías del foro

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `UUID` | PK |
| `name` | `TEXT` | Nombre de la categoría |
| `slug` | `TEXT` | URL slug (UNIQUE) |
| `description` | `TEXT` | Descripción |
| `icon` | `TEXT` | Emoji del ícono |
| `has_trigger_warning` | `BOOLEAN` | ¿Tiene aviso sensible? |
| `trigger_warning_text` | `TEXT` | Texto del aviso |
| `sort_order` | `INTEGER` | Orden de visualización |

**12 categorías pre-cargadas**: General, Síntomas, Medicación, Laboratorios, Nutrición, Ejercicio, Hashimoto, SOP, Embarazo, Salud Mental, Logros, Recursos.

---

### `community_threads` — Hilos del foro

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `UUID` | PK |
| `author_id` | `UUID` | FK → profiles (SET NULL on delete) |
| `category_id` | `UUID` | FK → community_categories |
| `title` | `TEXT` | Título del hilo |
| `content` | `TEXT` | Contenido |
| `is_anonymous` | `BOOLEAN` | Post anónimo |
| `is_pinned` | `BOOLEAN` | Fijado arriba |
| `is_locked` | `BOOLEAN` | Cerrado a respuestas |
| `has_trigger_warning` | `BOOLEAN` | Aviso de contenido sensible |
| `trigger_tags` | `TEXT[]` | Tags de trigger warning |
| `reply_count` | `INTEGER` | Contador de respuestas |
| `like_count` | `INTEGER` | Contador de likes |

### `community_replies` — Respuestas

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `UUID` | PK |
| `thread_id` | `UUID` | FK → community_threads |
| `author_id` | `UUID` | FK → profiles |
| `content` | `TEXT` | Contenido |
| `is_anonymous` | `BOOLEAN` | Respuesta anónima |
| `like_count` | `INTEGER` | Contador de likes |

### `buddy_matches` — Sistema Buddy

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `UUID` | PK |
| `user_a` | `UUID` | FK → profiles (quien inicia) |
| `user_b` | `UUID` | FK → profiles (quien recibe) |
| `status` | `TEXT` | `pending`, `active`, `declined`, `ended` |
| `match_reason` | `TEXT` | Razón del match |

---

## Indexes

```sql
idx_daily_logs_user_date      ON daily_logs(user_id, log_date DESC)
idx_lab_results_user_date     ON lab_results(user_id, test_date DESC)
idx_health_conditions_user    ON health_conditions(user_id)
idx_community_threads_category ON community_threads(category_id, created_at DESC)
idx_community_threads_author  ON community_threads(author_id)
idx_community_replies_thread  ON community_replies(thread_id, created_at ASC)
idx_buddy_matches_users       ON buddy_matches(user_a, user_b)
```
