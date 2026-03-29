---
id: config-email
title: 📧 Configuración de Correos
sidebar_label: 📧 Configuración de Correos
sidebar_position: 6
---

# Configuración de Plantillas de Correo (Supabase)

TiroVida utiliza el proveedor de autenticación de **Supabase** para gestionar el envío de correos transaccionales como Confirmación de Registro, Restablecimiento de Contraseña y links mágicos.

Este documento explica cómo configurar las plantillas de correo dentro del panel de control de Supabase para que coincidan con la marca "Ethereal Sanctuary" de TiroVida y apunten correctamente a los URLs de la plataforma en producción.

## 1. Acceso a las Plantillas

1. Inicia sesión en el **Dashbard de Supabase** (https://supabase.com/dashboard).
2. Selecciona el proyecto de **TiroVida**.
3. Navega a **Authentication** (icono de llave) > **Email Templates**.

## 2. Variables de Entorno (URLs Base)

Antes de editar las plantillas, asegúrate de configurar la **URL del Sitio** y las **URLs de Redirección (Redirect URLs)** en la sección **URL Configuration**.

- **Site URL:** Debe apuntar a la URL principal de la aplicación en Vercel (ej.: `https://tirovida.vercel.app`).
- **Additional Redirect URLs:** Agrega los dominios exactos y las rutas específicas de callbacks:
  - `https://tirovida.vercel.app/**`
  - `http://localhost:3000/**` (solo para desarrollo)

Las variables `{{ .SiteURL }}` y `{{ .ConfirmationURL }}` en las plantillas se resolverán automáticamente con base en esta configuración.

---

## 3. Plantillas Transaccionales

Puedes copiar y pegar el siguiente contenido HTML/CSS en cada sección correspondiente de Supabase.

> **💡 Nota de Diseño:** Las plantillas utilizan los colores principales del sistema de diseño (Lavanda: `#7C3AED` y Menta Suave: `#D1FAE5`) para mantener la coherencia con el look premium.

### Confirmación de Correo (ConfirmSignup)

Esta plantilla se envía tras un nuevo registro para validar la dirección de correo electrónico.

**Subject:**
```text
Confirma tu cuenta en TiroVida 🦋
```

**Body:**
```html
<div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 16px;">
  <div style="text-align: center; padding: 20px 0;">
    <h1 style="color: #1e293b; margin-bottom: 8px;">¡Bienvenid@ a TiroVida! 🦋</h1>
    <p style="color: #64748b; font-size: 16px;">Estamos muy felices de que te unas a nuestra comunidad.</p>
  </div>
  
  <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <p style="color: #334155; font-size: 15px; margin-bottom: 24px;">
      Para empezar a registrar tu bienestar, conectar con otros pacientes y construir tu santuario de salud, por favor confirma tu correo electrónico:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="background: linear-gradient(135deg, #7C3AED, #6D28D9); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
        Confirmar mi Correo
      </a>
    </div>
    
    <p style="color: #94a3b8; font-size: 13px; text-align: center; margin-top: 30px;">
      Si no solicitaste esta cuenta, simplemente ignora este correo.
    </p>
  </div>
</div>
```

---

### Recuperación de Contraseña (ResetPassword)

Se envía cuando el usuario utiliza la función "Olvidé mi contraseña".

**Subject:**
```text
Recuperación de contraseña de TiroVida 🔑
```

**Body:**
```html
<div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 16px;">
  <div style="text-align: center; padding: 20px 0;">
    <h1 style="color: #1e293b; margin-bottom: 8px;">Restablece tu Clave 🔑</h1>
  </div>
  
  <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <p style="color: #334155; font-size: 15px; margin-bottom: 24px;">
      Hemos recibido una solicitud para cambiar tu contraseña en TiroVida. Haz clic en el siguiente enlace para continuar:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
        Cambiar mi contraseña
      </a>
    </div>
    
    <p style="color: #94a3b8; font-size: 13px; text-align: center; margin-top: 30px;">
      Si no fuiste tú, por favor ignora este correo. El enlace es válido sólo por una hora.
    </p>
  </div>
</div>
```

---

### Enlace Mágico (MagicLink)

Si se desea habilitar el ingreso sin contraseña en el futuro.

**Subject:**
```text
Tu enlace mágico de acceso a TiroVida ✨
```

**Body:**
```html
<div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 16px;">
  <div style="text-align: center; padding: 20px 0;">
    <h1 style="color: #1e293b; margin-bottom: 8px;">Tu acceso directo ✨</h1>
  </div>
  
  <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <p style="color: #334155; font-size: 15px; margin-bottom: 24px;">
      Haz clic a continuación para entrar inmediatamente a TiroVida sin necesidad de contraseña:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
        Entrar a la Plataforma
      </a>
    </div>
  </div>
</div>
```

## 4. Servidor SMTP Personalizado (Recomendado para Producción)

Supabase permite hasta 3 correos por hora utilizando su proveedor por defecto durante la capa gratuita. Para un lanzamiento real, **es estrictamente necesario** configurar un proveedor SMTP propio (como Resend, SendGrid o AWS SES).

1. Ve a **Authentication > Providers > Email**.
2. Habilita y configura los datos de acceso **SMTP**:
   - **Host:** Servidor de tu proveedor SMTP (ej: `smtp.resend.com`)
   - **Port:** Normalmente `465` (SSL) o `587` (TLS).
   - **Username / Password:** Credenciales de la API SMTP.
   - **Sender Email:** `soporte@tirovida.com` (Debes haber verificado este dominio previamente en tu proveedor).
   - **Sender Name:** TiroVida Community.
