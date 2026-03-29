"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "tu correo";

  return (
    <div className="auth-card" style={{ textAlign: "center", padding: "var(--space-2xl) var(--space-xl)" }}>
      <div 
        style={{ 
          fontSize: "4rem", 
          marginBottom: "var(--space-lg)",
          background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
      >
        📨
      </div>
      <h1 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-md)", fontFamily: "var(--font-display)" }}>
        ¡Revisa tu bandeja!
      </h1>
      <p style={{ color: "var(--color-on-surface)", fontSize: "var(--text-md)", lineHeight: "var(--leading-loose)", marginBottom: "var(--space-xl)" }}>
        Te enviamos un enlace de confirmación a <br/>
        <strong style={{ color: "var(--color-primary)", fontWeight: 600 }}>{email}</strong>.
        <br/><br/>
        Haz clic en él para activar tu cuenta y poder ingresar al Santuario. Si no lo ves, revisa tu carpeta de Spam.
      </p>
      <Link
        href="/login"
        className="btn btn--primary btn--lg"
        style={{ width: "100%", marginTop: "var(--space-sm)" }}
      >
        Ir a Iniciar Sesión
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="auth-card text-center">Cargando...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
