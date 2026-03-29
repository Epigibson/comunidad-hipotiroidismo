---
id: administradores
title: "Panel del Administrador"
sidebar_position: 2
---

# 🛡️ Guía para Moderadores y Doctores

Los Endócrinos, Investigadores Médicos y dueños de la plataforma mantienen los cimientos de "TiroVida" funcionales y limpios a través del rol especial de `moderator`.

### Obtener el Rango de Moderador
Para evitar vulnerabilidades CSRF desde el Frontend, TiroVida no ofrece un "Botón de Petición de Administrador". 
1.  Todo rol inicia como `'patient'` o `'family'`.
2.  Para obtener permisos absolutos, debes **acceder directamente a Supabase** (`Table Editor -> profiles`), buscar tu registro Auth UUID, hacer doble clic en tu columna `role` y escribir exactamente **`moderator`**.
*   Inmediatamente tras recargar la plataforma, las funciones de censura y analíticas globales se desbloquearán ante tus ojos de forma reactiva (vía políticas RLS y protección de Layouts de servidor).

### Panel Analítico de TiroVida (`/admin/analytics`)
En vez de extraer manualmente cada pulso de la base, ve a la URL de escritorio restringida `/admin`. 
Ahí encontrarás visualizaciones Recharts exclusivas calculando volúmenes de usuarios, picos activos en la semana y "tasas de retorno":

### Curado Clínico: El Deber del Moderador
Como Administrador, la **Comunidad General** se adapta a tu sesión:
1.  Si ingresas a `/community` en Foro y un paciente ingresó una Receta Mágica Falsa ("Té Verde Quema Tiroides en Un Día"), verás un botón **Borrar (Trash Can)** en su tarjeta.
2.  Alguien ordinario no lo vería. Tu botón está conectado de forma letal a la base mediante GraphQL inverso (Supabase Fetch), lo cual pasará todas las defensas RLS locales. Te pedirá confirmación visual antes de desaparecerlo eternamente.

### Responsabilidad de la Metadata (DAU)
Monitorear activamente las Métricas en este panel te servirá para definir nuevas campañas publicitarias (SEO o anuncios) o entender en qué meses (como Invierno) decaen drásticamente los ánimos de las personas (Energy Levels). 
El ecosistema te da el mando total. Uságalo con inteligencia y respeto.
