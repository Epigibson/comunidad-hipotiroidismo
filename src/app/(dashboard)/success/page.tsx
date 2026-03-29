"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "¡Operación Exitosa!";
  const desc = searchParams.get("desc") || "Tus cambios han sido guardados correctamente en tu perfil de TiroVida.";
  const returnUrl = searchParams.get("returnTo") || "/dashboard";
  const returnText = searchParams.get("btnText") || "Volver al Inicio";

  return (
    <div className="animate-fadeInUp" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh',
      textAlign: 'center',
      padding: 'var(--space-xl)'
    }}>
      <div 
        style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          backgroundColor: 'var(--color-secondary-container)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
          marginBottom: 'var(--space-xl)',
          animation: 'pulse 2s infinite'
        }}
      >
        ✨
      </div>
      
      <h1 style={{ fontSize: 'var(--text-3xl)', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-md)' }}>
        {title}
      </h1>
      
      <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--text-lg)', maxWidth: '400px', marginBottom: 'var(--space-2xl)' }}>
        {desc}
      </p>

      <Link href={returnUrl} className="btn btn--secondary btn--lg" style={{ minWidth: '200px' }}>
        {returnText}
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Cargando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
