---
sidebar_position: 6
---

# 🚀 Deployment

## Vercel (Recomendado)

1. Conecta el repositorio a [vercel.com](https://vercel.com)
2. Configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. El directorio root es el proyecto principal (no `docs/`)
4. Deploy automático en cada push a `main`

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción local
npm start
```

## Documentación (Docusaurus)

```bash
# Desde la raíz del proyecto
cd docs

# Instalar dependencias
npm install

# Desarrollo
npm start

# Build
npm run build
```

:::info Puertos
- App: `localhost:3000`
- Docs: `localhost:3001` (configurar en `package.json` si hay conflicto)
:::
