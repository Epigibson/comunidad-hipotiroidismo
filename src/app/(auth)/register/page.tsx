"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [alias, setAlias] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            alias,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch {
      setError("Ocurrió un error inesperado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="auth-card">
        <form className="auth-form" onSubmit={handleRegister}>
          <h1 style={{ fontSize: "var(--text-xl)", textAlign: "center" }}>
            Crear tu cuenta
          </h1>

          {error && (
            <div className="badge badge--error" style={{ padding: "0.75rem", borderRadius: "var(--radius-md)", width: "100%", justifyContent: "center" }}>
              {error}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="alias" className="input-label">
              ¿Cómo te gustaría que te llamen?
            </label>
            <input
              id="alias"
              type="text"
              className="input"
              placeholder="Ej: Mariposa, Luna, Ana..."
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              required
              autoComplete="nickname"
            />
            <span className="input-helper">
              Puedes usar un seudónimo para mantener tu privacidad 🦋
            </span>
          </div>

          <div className="input-group">
            <label htmlFor="reg-email" className="input-label">
              Correo electrónico
            </label>
            <input
              id="reg-email"
              type="email"
              className="input"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="reg-password" className="input-label">
              Contraseña
            </label>
            <input
              id="reg-password"
              type="password"
              className="input"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          <div className="input-group">
            <label htmlFor="reg-confirm" className="input-label">
              Confirmar contraseña
            </label>
            <input
              id="reg-confirm"
              type="password"
              className="input"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--lg"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Creando cuenta..." : "Crear mi cuenta"}
          </button>

          <p style={{ fontSize: "var(--text-xs)", color: "var(--color-on-surface-variant)", textAlign: "center", lineHeight: "var(--leading-relaxed)" }}>
            Al crear tu cuenta aceptas que tus datos de salud son privados y solo tú puedes verlos.
            Esta app no sustituye la opinión médica profesional.
          </p>
        </form>
      </div>

      <p className="auth-footer">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login">Iniciar Sesión</Link>
      </p>
    </>
  );
}
