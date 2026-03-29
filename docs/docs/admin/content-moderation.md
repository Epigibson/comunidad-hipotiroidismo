---
sidebar_position: 3
---

# 🛡️ Moderación de Contenido

## Principios de moderación

1. **Proteger la seguridad emocional** de la comunidad
2. **No censurar** experiencias legítimas de pacientes
3. **Actuar rápido** ante contenido dañino
4. **Respetar el anonimato** — no intentar identificar usuarios anónimos

## Acciones desde la base de datos

### Fijar un hilo (pin)

```sql
UPDATE community_threads
SET is_pinned = true
WHERE id = 'thread-uuid';
```

### Cerrar un hilo (lock)

```sql
UPDATE community_threads
SET is_locked = true
WHERE id = 'thread-uuid';
```

### Eliminar una respuesta

```sql
DELETE FROM community_replies
WHERE id = 'reply-uuid';
```

### Eliminar un hilo y sus respuestas

```sql
-- Las respuestas se eliminan automáticamente (CASCADE)
DELETE FROM community_threads
WHERE id = 'thread-uuid';
```

## Contenido que debe moderarse

| Tipo | Acción |
|------|--------|
| Spam | Eliminar + suspender usuario |
| Acoso o bullying | Eliminar + warning o suspensión |
| Consejos médicos peligrosos | Eliminar + nota educativa |
| Desinformación sobre medicamentos | Eliminar + responder con info correcta |
| Contenido con suicidio | Eliminar + contactar recursos de crisis |
| Publicidad | Eliminar + suspender |

## Agregar trigger warning a un hilo

```sql
UPDATE community_threads
SET has_trigger_warning = true,
    trigger_tags = ARRAY['salud mental', 'contenido sensible']
WHERE id = 'thread-uuid';
```
