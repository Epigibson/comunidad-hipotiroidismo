"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { QRCodeSVG } from "qrcode.react";

export default function TwoFactorSetupPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  // Create or load the factor
  useEffect(() => {
    async function loadMFA() {
      try {
        const supabase = createClient();
        
        // Ensure user is truly AAL1 at least
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        // Check active factors
        const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
        if (factorsError) throw factorsError;
        
        const existingTotp = factors?.totp?.find(f => f.status === 'verified');
        if (existingTotp) {
          // Ya lo tiene configurado
          setError("Ya tienes la Autenticación de Dos Pasos configurada en tu cuenta.");
          setLoading(false);
          return;
        }

        // Generate a new TOTP factor
        const { data: newFactor, error: newFactorError } = await supabase.auth.mfa.enroll({
          factorType: 'totp',
          issuer: 'TiroVida',
          friendlyName: 'TiroVida Authenticator'
        });

        if (newFactorError) throw newFactorError;
        
        setFactorId(newFactor.id);
        const secret = newFactor.totp.qr_code;
        setQrCodeData(secret); // this is the authenticator auth URI

      } catch (err: any) {
        setError(err.message || "No pudimos generar el código QR. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    }

    loadMFA();
  }, [router]);

  async function handleConfirm(e: React.FormEvent) {
    if (e) e.preventDefault();
    if (!factorId) return;

    setIsVerifying(true);
    setError(null);

    try {
      const supabase = createClient();
      
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;
      
      const challengeId = challenge.id;
      
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code: verifyCode
      });
      
      if (verifyError) {
        throw new Error("El código parece ser incorrecto. Intenta generarlo de nuevo.");
      }

      // Éxito, ahora el factor está verificado. AAL elevate for current session.
      router.push("/success?title=Seguridad+Extra+Activada&desc=Tu+cuenta+ahora+está+protegida+con+autenticación+de+dos+pasos.&returnTo=/profile&btnText=Regresar+al+Perfil");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsVerifying(false);
    }
  }

  if (loading) {
    return <div className="text-center p-8">Cargando la bóveda de seguridad...</div>;
  }

  return (
    <div className="animate-fadeInUp" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: 'var(--space-2xl)' }}>
        <h1 className="page-header__title">
          Autenticación en Dos Pasos (2FA)
        </h1>
        <p className="page-header__subtitle">
          Protege tu cuenta y tus registros de salud requiriendo un código adicional al iniciar sesión.
        </p>
      </div>

      <div className="profile-section">
        <h2 className="profile-section__title">1. Escanea este código</h2>
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-surface-container-low)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', textAlign: 'center', marginBottom: 'var(--space-md)' }}>
           {qrCodeData ? (
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <div style={{ padding: 'var(--space-md)', background: 'white', borderRadius: 'var(--radius-md)', display: 'inline-block' }}>
                 <QRCodeSVG value={qrCodeData} size={200} level="M" includeMargin={false} />
               </div>
               <p style={{ marginTop: 'var(--space-md)', fontSize: 'var(--text-sm)', color: 'var(--color-on-surface-variant)' }}>
                 Abre tu app (Google Authenticator, Authy, etc) y escanea.
               </p>
             </div>
           ) : (
             <p>{error}</p>
           )}
        </div>

        <h2 className="profile-section__title">2. Ingresa el PIN generado</h2>
        <form onSubmit={handleConfirm} style={{ backgroundColor: 'var(--color-surface-container-low)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)' }}>
          {error && qrCodeData && (
             <div className="badge badge--error" style={{ marginBottom: "var(--space-md)", width: "100%", justifyContent: "center", padding: '12px' }}>
                {error}
             </div>
          )}

          <div className="input-group" style={{ marginBottom: 'var(--space-lg)' }}>
            <label htmlFor="auth-code" className="input-label">
              Código de 6 dígitos
            </label>
            <input
              id="auth-code"
              type="text"
              className="input"
              autoComplete="off"
              inputMode="numeric"
              pattern="[0-9]{6}"
              placeholder="000 000"
              maxLength={6}
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
              required
              disabled={!qrCodeData}
              style={{ fontSize: "1.5rem", letterSpacing: "0.2em", textAlign: "center", height: "60px" }}
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--lg"
            disabled={isVerifying || verifyCode.length < 6 || !qrCodeData}
            style={{ width: "100%" }}
          >
            {isVerifying ? "Verificando token..." : "Verificar y Activar"}
          </button>

          <Link
            href="/profile"
            className="btn btn--ghost mt-4"
            style={{ width: "100%", outline: 'none', border: 'none', textAlign: 'center', display: 'block' }}
          >
            Cancelar
          </Link>
        </form>
      </div>
    </div>
  );
}
