---
sidebar_position: 5
---

# 📊 Analytics

## Queries útiles para analytics

### Total de usuarios registrados

```sql
SELECT COUNT(*) AS total_users FROM profiles;
```

### Usuarios activos (últimos 7 días)

```sql
SELECT COUNT(DISTINCT user_id) AS active_users
FROM daily_logs
WHERE log_date >= CURRENT_DATE - INTERVAL '7 days';
```

### Distribución de roles

```sql
SELECT role, COUNT(*) AS count
FROM profiles
GROUP BY role
ORDER BY count DESC;
```

### Síntomas promedio de la comunidad (últimos 30 días)

```sql
SELECT 
  ROUND(AVG(energy_level), 1) AS avg_energy,
  ROUND(AVG(brain_fog_level), 1) AS avg_brain_fog,
  ROUND(AVG(mood_level), 1) AS avg_mood,
  ROUND(AVG(joint_pain_level), 1) AS avg_joint_pain
FROM daily_logs
WHERE log_date >= CURRENT_DATE - INTERVAL '30 days';
```

### Categorías más activas

```sql
SELECT 
  cc.name,
  COUNT(ct.id) AS thread_count,
  SUM(ct.reply_count) AS total_replies
FROM community_categories cc
LEFT JOIN community_threads ct ON ct.category_id = cc.id
GROUP BY cc.name
ORDER BY thread_count DESC;
```

### Usuarios con mayor racha

```sql
-- Aproximación: usuarios con más logs consecutivos recientes
SELECT 
  p.alias,
  COUNT(dl.id) AS total_logs
FROM profiles p
JOIN daily_logs dl ON dl.user_id = p.id
WHERE dl.log_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY p.alias
ORDER BY total_logs DESC
LIMIT 10;
```

### Distribución de TSH

```sql
SELECT
  CASE
    WHEN tsh_level < 0.4 THEN 'Bajo (<0.4)'
    WHEN tsh_level BETWEEN 0.4 AND 4.0 THEN 'Normal (0.4-4.0)'
    WHEN tsh_level BETWEEN 4.0 AND 10.0 THEN 'Elevado (4.0-10.0)'
    ELSE 'Muy elevado (>10.0)'
  END AS tsh_range,
  COUNT(*) AS count
FROM lab_results
WHERE tsh_level IS NOT NULL
GROUP BY tsh_range
ORDER BY count DESC;
```

## Dashboard de Supabase

También puedes ver métricas básicas en el Dashboard:

- **Authentication**: Usuarios registrados, logins
- **Database**: Rows por tabla, queries
- **Storage**: Archivos subidos

[Abrir Dashboard](https://supabase.com/dashboard/project/jdndcaokvcggxxxgtmei)
