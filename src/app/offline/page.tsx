"use client";

export default function OfflinePage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: 'var(--space-xl)',
      backgroundColor: 'var(--color-surface)'
    }}>
      <div 
        style={{ 
          fontSize: "4rem", 
          marginBottom: "var(--space-md)",
          filter: "grayscale(100%)",
          opacity: 0.7
        }}
      >
        📴
      </div>
      <h1 style={{ 
        fontSize: 'var(--text-2xl)', 
        fontFamily: 'var(--font-display)', 
        marginBottom: 'var(--space-sm)',
        color: 'var(--color-on-surface)'
      }}>
        Sin Conexión a Internet
      </h1>
      <p style={{ 
        color: 'var(--color-on-surface-variant)', 
        fontSize: 'var(--text-lg)', 
        maxWidth: '400px', 
        marginBottom: 'var(--space-xl)',
        lineHeight: 'var(--leading-relaxed)'
      }}>
        Parece que estás fuera de línea. Tus datos anteriores están seguros gracias a nuestra modalidad de lectura, pero para registrar nuevos debes reconectarte.
      </p>

      {/* Al estar offline usamos un simple refrescar nativo de ventana al intentar re-conectar */}
      <button 
        className="btn btn--primary btn--lg" 
        onClick={() => window.location.reload()}
        style={{ minWidth: '200px' }}
      >
        Intentar conectarse
      </button>
    </div>
  );
}
