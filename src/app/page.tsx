import Link from "next/link";
import "./landing.css";

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Nav */}
      <nav className="landing-nav">
        <div className="container flex items-center justify-between">
          <Link href="/" className="landing-nav__brand">
            <span className="landing-nav__icon">🦋</span>
            <span className="landing-nav__name">TiroVida</span>
          </Link>
          <div className="landing-nav__actions">
            <Link href="/login" className="btn btn--ghost">
              Iniciar Sesión
            </Link>
            <Link href="/register" className="btn btn--premium-glow">
              Crear Cuenta
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div className="hero__badge-container">
            <div className="hero__badge">
              <span className="hero__badge-icon">✨</span> Para ti, por ti
            </div>
          </div>

          <h1 className="hero__title">
            Domina el <span className="hero__highlight">hipotiroidismo</span><br />
            recupera tu energía.
          </h1>
          
          <p className="hero__subtitle">
            Tracker clínico, visualización de laboratorios y una comunidad privada diseñada exclusivamente para pacientes con condiciones tiroideas.
          </p>
          
          <div className="hero__actions">
            <Link href="/register" className="btn btn--premium-glow btn--lg">
              Comenzar Gratis
            </Link>
          </div>

          {/* Floating UI Mockup */}
          <div className="hero__mockup">
            <div className="hero__mockup-header">
              <div className="mockup-dot"></div>
              <div className="mockup-dot"></div>
              <div className="mockup-dot"></div>
            </div>
            <div className="hero__mockup-body">
              <div className="mockup-sidebar">
                <div className="mockup-card" style={{ padding: '16px' }}>
                  <div style={{ color: '#c4b5fd', fontSize: '12px', marginBottom: '8px' }}>ENERGÍA HOY</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>8/10</div>
                </div>
                <div className="mockup-card" style={{ padding: '16px' }}>
                  <div style={{ color: '#c4b5fd', fontSize: '12px', marginBottom: '8px' }}>NIEBLA MENTAL</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Baja</div>
                </div>
              </div>
              <div className="mockup-graph">
                <div className="mockup-bar"></div>
                <div className="mockup-bar"></div>
                <div className="mockup-bar"></div>
                <div className="mockup-bar"></div>
                <div className="mockup-bar"></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="features" id="features">
        <div className="container">
          <h2 className="features__title">Clínico pero Humano.</h2>
          <p className="features__subtitle">
            Diseñamos herramientas para que dejes de adivinar y empieces a entender el lenguaje de tu propio cuerpo.
          </p>
          
          <div className="bento-grid">
            <div className="bento-card bento-card--large">
              <div className="bento-card__icon">📊</div>
              <h3 className="bento-card__title">Registro Diario de Biomarcadores</h3>
              <p className="bento-card__desc">
                Registra tus niveles de energía, niebla mental (brain fog), estado de ánimo y dolor articular
                en menos de 10 segundos al día. Identifica qué dispara tus síntomas.
              </p>
            </div>
            
            <div className="bento-card">
              <div className="bento-card__icon">🔬</div>
              <h3 className="bento-card__title">Historial de TSH y Labs</h3>
              <p className="bento-card__desc">
                Archiva tus T3, T4 y Anti-TPO. Gráficas visuales que le dan sentido a tus números.
              </p>
            </div>
            
            <div className="bento-card">
              <div className="bento-card__icon">💬</div>
              <h3 className="bento-card__title">Foros Seguros The Sanctuary</h3>
              <p className="bento-card__desc">
                Anonimato opcional y protección contra triggers. Un refugio de moderación total.
              </p>
            </div>
            
            <div className="bento-card bento-card--large">
              <div className="bento-card__icon">📱</div>
              <h3 className="bento-card__title">Instalación Nativa Offline</h3>
              <p className="bento-card__desc">
                TiroVida es una PWA (Progressive Web App). Presiona "Añadir a Inicio" en tu celular y 
                úsala como una app nativa, rápida y que no consume tus datos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Glass */}
      <section className="container">
        <div className="cta-glass">
          <h2 className="cta-glass__title">
            No estás sola en esto.
          </h2>
          <p className="cta-glass__desc">
            Únete a la mayor comunidad de mujeres y hombres que entienden perfectamente lo que significa vivir con fatiga crónica.
          </p>
          <Link href="/register" className="btn btn--premium-glow btn--lg">
            Crear mi cuenta gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div style={{ fontFamily: 'var(--font-headline)', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>
            <span>🦋</span> TiroVida
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-outline)', maxWidth: '500px', margin: '0 auto 16px' }}>
            TiroVida es una herramienta de soporte comunitario. No proporciona
            diagnósticos ni sustituye la opinión de un profesional de salud.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-outline)' }}>
            © {new Date().getFullYear()} TiroVida. Hecho con 💜 para la comunidad tiroidea.
          </p>
        </div>
      </footer>
    </div>
  );
}
