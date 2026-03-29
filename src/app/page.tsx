import Link from "next/link";
import "./landing.css";

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Nav */}
      <nav className="landing-nav">
        <div className="container flex items-center justify-between">
          <div className="landing-nav__brand">
            <span className="landing-nav__icon">🦋</span>
            <span className="landing-nav__name">TiroVida</span>
          </div>
          <div className="landing-nav__actions">
            <Link href="/login" className="btn btn--ghost">
              Iniciar Sesión
            </Link>
            <Link href="/register" className="btn btn--primary">
              Crear Cuenta
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero__content">
            <div className="hero__badge">
              <span className="badge badge--primary">🦋 Para ti, por ti</span>
            </div>
            <h1 className="hero__title">
              Tu compañera en el camino del{" "}
              <span className="hero__highlight">hipotiroidismo</span>
            </h1>
            <p className="hero__subtitle">
              Registra tus síntomas, entiende tus laboratorios y conecta con una
              comunidad que sabe lo que vives. Todo en un solo lugar, seguro y
              privado.
            </p>
            <div className="hero__actions">
              <Link href="/register" className="btn btn--primary btn--lg">
                Comenzar Gratis
              </Link>
              <Link href="#features" className="btn btn--outline btn--lg">
                Conocer más
              </Link>
            </div>
            <p className="hero__disclaimer">
              100% gratuito · Tus datos son privados · No sustituye opinión médica
            </p>
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="hero__blob hero__blob--1" aria-hidden="true" />
        <div className="hero__blob hero__blob--2" aria-hidden="true" />
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="container">
          <h2 className="features__title">Todo lo que necesitas</h2>
          <p className="features__subtitle">
            Herramientas diseñadas especialmente para personas con hipotiroidismo,
            Hashimoto y SOP.
          </p>
          <div className="features__grid">
            <div className="feature-card">
              <div className="feature-card__icon">📊</div>
              <h3 className="feature-card__title">Registro Diario</h3>
              <p className="feature-card__desc">
                Registra energía, niebla mental, estado de ánimo y dolor articular
                con una escala visual rápida.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">🔬</div>
              <h3 className="feature-card__title">Laboratorios</h3>
              <p className="feature-card__desc">
                Guarda tus resultados de TSH, T3, T4 y anticuerpos. Visualiza
                tendencias y rangos de referencia.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">📈</div>
              <h3 className="feature-card__title">Correlación Clínica</h3>
              <p className="feature-card__desc">
                Genera reportes que conectan tus síntomas con tus labs para
                compartir con tu endocrinólogo.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">💬</div>
              <h3 className="feature-card__title">Comunidad Segura</h3>
              <p className="feature-card__desc">
                Foros moderados con opción de participar de forma anónima.
                Trigger warnings para temas sensibles.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">🤝</div>
              <h3 className="feature-card__title">Sistema Buddy</h3>
              <p className="feature-card__desc">
                Conecta con alguien que comparte tu diagnóstico para apoyarse
                mutuamente en el camino.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">📱</div>
              <h3 className="feature-card__title">App Instalable</h3>
              <p className="feature-card__desc">
                Instálala en tu teléfono como una app nativa. Funciona incluso
                sin conexión a internet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <div className="cta__card">
            <h2 className="cta__title">
              No estás sola en esto 🦋
            </h2>
            <p className="cta__desc">
              Únete a una comunidad que entiende lo que es vivir con
              hipotiroidismo. Tu bienestar importa.
            </p>
            <Link href="/register" className="btn btn--primary btn--lg">
              Crear mi cuenta gratis
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="landing-footer__brand">
            <span>🦋</span> TiroVida
          </div>
          <p className="landing-footer__disclaimer">
            TiroVida es una herramienta de registro y comunidad. No proporciona
            diagnósticos ni sustituye la opinión de un profesional de salud.
          </p>
          <p className="landing-footer__copy">
            © {new Date().getFullYear()} TiroVida. Hecho con 💜 para la comunidad tiroidea.
          </p>
        </div>
      </footer>
    </div>
  );
}
