import "./auth.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <header className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo__icon">🦋</div>
            <span className="auth-logo__text">TiroVida</span>
          </div>
          <p className="auth-header__subtitle">
            Tu compañera en el camino del hipotiroidismo
          </p>
        </header>
        {children}
      </div>
    </div>
  );
}
