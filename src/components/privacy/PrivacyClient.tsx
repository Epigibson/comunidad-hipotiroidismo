"use client";

import { useState } from "react";

export default function PrivacyClient() {
  const [sharing, setSharing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="module-page" style={{ maxWidth: 800, margin: "0 auto" }}>
      <div className="module-header">
        <h1 className="module-title">Centro de Privacidad</h1>
        <p style={{ color: "var(--color-on-surface-variant)" }}>
          Controla cómo se manejan tus datos de salud. En TiroVida, tu privacidad 
          es nuestra prioridad absoluta.
        </p>
      </div>

      <div className="privacy-sections">
        <div className="privacy-card">
          <div className="privacy-card__header">
            <div className="privacy-card__title">
              <span>👥</span> Perfil Público en Comunidad
            </div>
            <div 
              className={`privacy-toggle ${sharing ? "privacy-toggle--on" : ""}`}
              onClick={() => setSharing(!sharing)}
            />
          </div>
          <p className="privacy-card__desc">
            Si está activado, otros usuarios podrán ver tu foto de perfil, alias y 
            fecha de unión al foro. Tus síntomas y laboratorios <strong>nunca</strong> son públicos.
          </p>
        </div>

        <div className="privacy-card">
          <div className="privacy-card__header">
            <div className="privacy-card__title">
              <span>📊</span> Analíticas Anónimas
            </div>
            <div 
              className={`privacy-toggle ${analytics ? "privacy-toggle--on" : ""}`}
              onClick={() => setAnalytics(!analytics)}
            />
          </div>
          <p className="privacy-card__desc">
            Nos ayudas a mejorar agregando tus datos de forma 100% anónima para 
            entender las tendencias globales del hipotiroidismo. No comparte información personal.
          </p>
        </div>

        <div className="privacy-card">
          <div className="privacy-card__header">
            <div className="privacy-card__title">
              <span>🔔</span> Notificaciones Push
            </div>
            <div 
              className={`privacy-toggle ${notifications ? "privacy-toggle--on" : ""}`}
              onClick={() => setNotifications(!notifications)}
            />
          </div>
          <p className="privacy-card__desc">
            Recibe alertas sobre tu medicación, nuevos artículos y menciones en 
            la comunidad.
          </p>
        </div>

        <div className="privacy-card" style={{ borderColor: "var(--color-error-container)", marginTop: "var(--space-lg)" }}>
          <div className="privacy-card__header">
            <div className="privacy-card__title" style={{ color: "var(--color-error)" }}>
              <span>⚠️</span> Zona de Peligro
            </div>
          </div>
          <p className="privacy-card__desc" style={{ marginBottom: "var(--space-md)" }}>
            Eliminar tu cuenta borrará permanentemente todos tus registros 
            diarios, laboratorios y perfiles. Esta acción no se puede deshacer.
          </p>
          <button className="btn" style={{ background: "var(--color-error-container)", color: "var(--color-on-error-container)" }}>
            Eliminar cuenta permanentemente
          </button>
        </div>
      </div>
    </div>
  );
}
