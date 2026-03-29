"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function TwoFactorAuthPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [factorId, setFactorId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in at AAL1 to get their MFA factors
    async function checkAuth() {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData.user) {
        router.push("/login"); // User is not authenticated at all
        return;
      }

      // Identify the TOTP factor to challenge
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (!factorsError && factors?.totp?.length > 0) {
        setFactorId(factors.totp[0].id);
      } else {
        // Fallback or error if no TOTP factor found
        setError("No se detectó una configuración de 2FA en tu cuenta. Por favor contacta a soporte.");
      }
    }

    checkAuth();
  }, [router]);

  async function handleVerify(e: React.FormEvent) {
    if (e) e.preventDefault();
    if (!factorId) return;
    
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      
      // We initiate a challenge
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      
      if (challengeError) {
        setError(challengeError.message);
        return;
      }

      // Then verify the token the user typed
      const challengeId = challenge.id;
      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code
      });

      if (verifyError || !verifyData) {
        setError("Código incorrecto o ha expirado. Revisa tu aplicación generadora e intenta de nuevo.");
        return;
      }

      // Promoted to AAL2 successfully!
      router.push("/dashboard");
      router.refresh();

    } catch (err) {
      setError("Ocurrió un error inesperado al validar el código.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <form className="auth-form" onSubmit={handleVerify}>
        <div style={{ textAlign: "center", fontSize: "3rem", marginBottom: "var(--space-md)", opacity: 0.8 }}>
          🔐
        </div>
        <h1 style={{ fontSize: "var(--text-xl)", textAlign: "center", marginBottom: "var(--space-sm)" }}>
          Capa de Seguridad Extra
        </h1>
        <p style={{ color: "var(--color-on-surface-variant)", textAlign: "center", fontSize: "var(--text-sm)", marginBottom: "var(--space-xl)" }}>
          Ingresa el código de 6 dígitos generado por tu aplicación de autenticación para continuar.
        </p>

        {error && (
          <div className="badge badge--error" style={{ padding: "0.75rem", borderRadius: "var(--radius-md)", width: "100%", justifyContent: "center" }}>
            {error}
          </div>
        )}

        <div className="input-group">
          <label htmlFor="totp-code" className="input-label" style={{ textAlign: "center", width: "100%" }}>
            Código de Verificación
          </label>
          <input
            id="totp-code"
            type="text"
            className="input"
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="000000"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // only allow numbers
            style={{ fontSize: "2rem", letterSpacing: "0.5em", textAlign: "center", height: "80px", padding: "0" }}
            required
            autoFocus
          />
        </div>

        <button
          type="submit"
          className="btn btn--primary btn--lg"
          disabled={loading || code.length < 6 || !factorId}
          style={{ width: "100%", marginTop: "var(--space-md)" }}
        >
          {loading ? "Verificando..." : "Confirmar Acceso"}
        </button>
        
        <button
          type="button"
          onClick={() => {
            const supabase = createClient();
            supabase.auth.signOut().then(() => router.push("/login"));
          }}
          className="btn btn--ghost mt-4"
          style={{ width: "100%" }}
        >
          Cancelar e iniciar sesión con otra cuenta
        </button>
      </form>
    </div>
  );
}
