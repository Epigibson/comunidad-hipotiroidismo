---
sidebar_position: 6
---

# 🚀 Deployment y Mantenimiento

## Stack de deployment

| Servicio | Uso | URL |
|----------|-----|-----|
| Vercel | Frontend (Next.js) | tirovida.vercel.app |
| Supabase | Backend (DB, Auth) | jdndcaokvcggxxxgtmei.supabase.co |
| Docusaurus | Documentación | tirovida-docs.vercel.app |

## Deployment del Frontend

### Deploy automático (recomendado)

1. Push a `main` → Vercel hace build automático
2. PRs generan preview deployments

### Deploy manual

```bash
npm run build
npx vercel --prod
```

## Deployment de la Documentación

```bash
cd docs
npm run build
npx vercel --prod
```

## Migraciones en producción

```bash
# 1. Crear la migración
npx supabase migration new mi_cambio

# 2. Escribir el SQL en el archivo generado

# 3. Aplicar a producción
npx supabase db push
```

:::danger Backup antes de migrar
Siempre haz un backup de la base de datos antes de ejecutar migraciones en producción.
:::

## Monitoreo

### Supabase Dashboard
- **Database**: Performance, queries lentos
- **Auth**: Logins fallidos, usuarios bloqueados  
- **Logs**: Errores del API

### Vercel Dashboard
- **Deployments**: Estado de builds
- **Analytics**: Tráfico, performance
- **Logs**: Errores del server

## Checklist de mantenimiento mensual

- [ ] Revisar logs de errores en Supabase
- [ ] Verificar que RLS sigue activo en todas las tablas
- [ ] Revisar reportes de moderación pendientes
- [ ] Actualizar dependencias (`npm update`)
- [ ] Verificar backups de base de datos
- [ ] Revisar métricas de uso (usuarios activos, engagement)
