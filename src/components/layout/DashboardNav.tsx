"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface DashboardNavProps {
  user: {
    alias: string;
    avatarUrl: string | null;
    role: string;
  };
}

export function DashboardNav({ user }: DashboardNavProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="dashboard-nav">
      <div className="dashboard-nav__inner">
        <Link href="/dashboard" className="dashboard-nav__brand">
          <span className="dashboard-nav__brand-icon">🦋</span>
          TiroVida
        </Link>

        <div className="dashboard-nav__right" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <span className="dashboard-nav__greeting">
            Hola, <strong>{user.alias}</strong>
          </span>
          <Link href="/notifications" className="btn btn--ghost btn--sm" style={{ padding: '4px', fontSize: '1.2rem', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            🔔
          </Link>
          <div className="avatar avatar--sm">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.alias} />
            ) : (
              user.alias.charAt(0).toUpperCase()
            )}
          </div>
          <button
            className="btn btn--ghost btn--sm"
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
