---
id: backend
title: "Supabase, Auth y Seguridad"
sidebar_position: 2
---

# 🔐 Arquitectura Backend de TiroVida

La bóveda de datos sensibles de la plataforma debe resistir fugas o extracciones masivas de información (scrapers). 
Para esto, **TiroVida ha abandonado los modelos tradicionales** (donde los servidores tienen deidades de poder absoluto) para ceder el paso a bases de datos relacionales inteligentes configuradas en Supabase CLI.

### El Corazón de PostgreSQL
*   Las relaciones están engranadas limpiamente (P. ej., el histórico de sangre `lab_results` está referenciado forzosamente al ID único criptográfico del paciente en Auth `profiles`). Si se da de baja al paciente, sus historiales son arrastrados (purga limpia CASCADA).

### Auditoría Infranqueable (RLS)
Supabase usa **PostgreSQL Row Level Security (RLS)** para auditar el perfil del JWT (json-web-token) antes de entregar cada bloque del servidor.
*   **Aislamiento de Laboratorio:** Un usuario puede tratar de enviar a la API un borrado de registro (`DELETE from daily_logs`), pero si la ID anexada del registro no pertenece a la misma entidad que firmó el token, PostgreSQL cortará la acción al vuelo devolviendo "Cero Filas Editadas".

### Flujos de Múltiple Factor (TOTP & MFA)
TiroVida incluye interceptores visuales y enrutamientos exigentes sobre **Seguridad AAL2**.
1.  **AAL1 (Correo-Contraseña)**: Inicio tradicional.
2.  **Interceptación AAL2**: Si el usuario ha vinculado su aplicación desde el panel principal de Configuración con el Código QR generado dinámicamente (`src/app/(dashboard)/profile/2fa/`), se le redirigirá con una pared gris a la bóveda `/2fa` intermedia hasta que teclee el pin temporal.

### Prevención de Fraudes y Moderadores
Toda cuenta en la comunidad es nominal, incluso cuando se esconde con el flag estático de "**is_anonymous**" = `true`.
*   Un usuario puede publicar encubierto (lo que omite revelar su Alias `is_anonymous ? 'Anónimo' : p.alias`). 
*   Sin embargo, gracias al blindaje estricto en el Backend que pre-firmé, incluso enviando posts engañosos, la DB siempre imprimirá el `author_id` del token para que los Doctores Administradores con rango de Moderador (`role='moderator'`) puedan revisar fraudes y dar debajo contenido.
