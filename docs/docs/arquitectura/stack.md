---
id: stack
title: "Tech Stack Base"
sidebar_position: 1
---

# 🏗️ Arquitectura General: TiroVida

La plataforma TiroVida está construida sobre las tecnologías web más modernas, buscando la delgada línea entre una aplicación nativa instalable y un portal inmensamente indexado para posicionamiento SEO.

### El Motor Principal: Next.js 16 (App Router)
Todo el renderizado y la lógica central de TiroVida fluye a través del esquema moderno de **Aplicación en Servidor (RSC)**.

*   **Rendimiento en Servidor (SSR):** Las pantallas iniciales cargan al instante al venir pre-renderizadas desde Node. 
*   **Optimizaciones:** Se habilitó el empaquetador iterativo de alto rendimiento (`experimental: { turbopack: {} }`) para acortar tiempos de compilación local.

### El Sistema Nervioso: Supabase
En vez de operar bases de datos caseras, toda la orquestación criptográfica, de almacenamiento, autenticación biométrica de JWT y la base de datos subyacen sobre un Servidor **PostgreSQL de Supabase** fuertemente auditado mediante políticas "Row Level Security".

### Experiencia Nativa (PWA Offline)
Hemos forzado que TiroVida se burle del típico "sitio web vacío sin red" usando `@ducanh2912/next-pwa`.
*   El motor inyecta por debajo de la interfaz un *Service Worker* compilado en `sw.js`.
*   Incluso ante caídas en seco, un Cache Storage guarda todo el CSS (Ethereal Sanctuary) y carga una pantalla propia `/offline` de *Fallo de Red* en lugar del dinosaurio del navegador. ¡Añadir el ícono a iOS/Android abre la app en un modal nativo a pantalla completa sin URL!

### Lenguaje Estricto `[TypeScript]`
Toda la interacción del paciente está acorazada con las inferencias más modernas del compilador de TypeScript (`npx supabase gen types typescript`). 
Las inserciones o consultas ambiguas `(as any)` fueron purgadas completamente del código para prevenir errores que colapsarían el flujo médico.
