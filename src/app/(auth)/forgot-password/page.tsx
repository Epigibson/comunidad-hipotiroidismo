"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    setLoading(false);

    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="auth-standalone">
      <div className="auth-standalone__card">
        {sent ? (
          <>
            <div className="auth-standalone__icon">📧</div>
            <h1 className="auth-standalone__title">¡Correo enviado!</h1>
            <p className="auth-standalone__subtitle">
              Revisa tu bandeja de entrada en <strong>{email}</strong>.
              Haz clic en el enlace para restablecer tu contraseña.
            </p>
            <a href="/login" className="btn btn--primary" style={{ width: "100%", textAlign: "center", display: "block" }}>
              ← Volver al inicio de sesión
            </a>
          </>
        ) : (
          <>
            <div className="auth-standalone__icon">🔑</div>
            <h1 className="auth-standalone__title">Recuperar contraseña</h1>
            <p className="auth-standalone__subtitle">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-md">
              <div className="input-group">
                <label className="input-label">Correo electrónico</label>
                <input
                  type="email"
                  className="input"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-error text-sm">⚠️ {error}</p>}

              <button type="submit" className="btn btn--primary btn--lg" disabled={loading} style={{ width: "100%" }}>
                {loading ? "Enviando..." : "📧 Enviar enlace"}
              </button>

              <a href="/login" className="btn btn--ghost" style={{ textAlign: "center" }}>
                ← Volver al inicio de sesión
              </a>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
