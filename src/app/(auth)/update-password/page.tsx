"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (err) {
      setError(err.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  }

  return (
    <div className="auth-standalone">
      <div className="auth-standalone__card">
        {success ? (
          <>
            <div className="auth-standalone__icon">✅</div>
            <h1 className="auth-standalone__title">¡Contraseña actualizada!</h1>
            <p className="auth-standalone__subtitle">
              Tu contraseña ha sido cambiada exitosamente. Redirigiendo al dashboard...
            </p>
          </>
        ) : (
          <>
            <div className="auth-standalone__icon">🔐</div>
            <h1 className="auth-standalone__title">Nueva contraseña</h1>
            <p className="auth-standalone__subtitle">
              Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-md">
              <div className="input-group">
                <label className="input-label">Nueva contraseña</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Confirmar contraseña</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-error text-sm">⚠️ {error}</p>}

              <button type="submit" className="btn btn--primary btn--lg" disabled={loading} style={{ width: "100%" }}>
                {loading ? "Actualizando..." : "🔐 Actualizar contraseña"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
