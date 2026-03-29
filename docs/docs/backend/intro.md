---
sidebar_position: 1
slug: /backend/intro
---

# 🦋 Backend — TiroVida

Bienvenido a la documentación técnica del backend de **TiroVida**, la plataforma comunitaria para el manejo de hipotiroidismo, Hashimoto y SOP.

## Stack Tecnológico

| Tecnología | Uso | Versión |
|------------|-----|---------|
| **Supabase** | BaaS (PostgreSQL, Auth, Storage, RLS) | Cloud |
| **PostgreSQL** | Base de datos relacional | 15+ |
| **Next.js 16** | API Routes + Server Components | 16.2.1 |
| **@supabase/ssr** | Cliente Supabase para SSR | Latest |

## Arquitectura General

```
┌─────────────────────────────────────────────┐
│                  Cliente (Browser)           │
│          Next.js App Router + React          │
└──────────────────┬──────────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────────┐
│            Next.js Server (Vercel)           │
│  ┌────────────┐  ┌────────────────────────┐ │
│  │  proxy.ts   │  │  Server Components     │ │
│  │ (session    │  │  (data fetching)       │ │
│  │  refresh)   │  │                        │ │
│  └──────┬─────┘  └──────────┬─────────────┘ │
└─────────┼───────────────────┼───────────────┘
          │                   │
┌─────────▼───────────────────▼───────────────┐
│              Supabase Cloud                  │
│  ┌──────────┐ ┌──────┐ ┌────────────────┐  │
│  │PostgreSQL│ │ Auth │ │    Storage      │  │
│  │  + RLS   │ │      │ │  (Lab files)   │  │
│  └──────────┘ └──────┘ └────────────────┘  │
└─────────────────────────────────────────────┘
```

## Principios de Diseño

1. **Privacidad ante todo**: Los datos de salud están protegidos con RLS estricto. Solo el propietario puede ver sus datos biométricos.
2. **Zero-trust**: Cada query a la base de datos pasa por políticas RLS que verifican `auth.uid()`.
3. **Typed end-to-end**: TypeScript types manuales para toda la base de datos.
4. **Server-first**: Los datos sensibles se obtienen con Server Components, nunca expuestos al cliente.

## Proyecto Supabase

| Campo | Valor |
|-------|-------|
| Project ID | `jdndcaokvcggxxxgtmei` |
| Región | US East (North Virginia) |
| Dashboard | [Abrir Dashboard](https://supabase.com/dashboard/project/jdndcaokvcggxxxgtmei) |

## Secciones

- 📊 [Esquema de Base de Datos](./database/schema) — Tablas, columnas y relaciones
- 🔒 [Políticas RLS](./database/rls-policies) — Seguridad a nivel de fila
- ⚡ [Triggers y Funciones](./database/triggers) — Automatizaciones
- 🔄 [Migraciones](./database/migrations) — Gestión de cambios
- 🔐 [Autenticación](./auth/overview) — Flujo de Auth
- 🌐 [API y Clientes](./api/supabase-client) — Configuración de clientes
- 🔧 [Variables de Entorno](./environment) — Configuración
