"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "🏠", label: "Inicio" },
  { href: "/tracker", icon: "📝", label: "Registrar" },
  { href: "/labs", icon: "🔬", label: "Labs" },
  { href: "/community", icon: "💬", label: "Comunidad" },
  { href: "/profile", icon: "👤", label: "Perfil" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav__item${isActive ? " bottom-nav__item--active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="bottom-nav__icon">{item.icon}</span>
            <span className="bottom-nav__label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
