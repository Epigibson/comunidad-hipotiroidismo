"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "📊 Overview", path: "/admin" },
    { id: "content", label: "📝 CMS Artículos", path: "/admin/content" },
    { id: "analytics", label: "📈 Analítica", path: "/admin/analytics" },
  ];

  function handleNav(id: string, path: string) {
    setActiveTab(id);
    router.push(path);
  }

  return (
    <div className="module-page" style={{ minHeight: "80vh" }}>
      <div className="module-header">
        <h1 className="module-title" style={{ color: "var(--color-error)" }}>
          🛡️ Panel de Administración
        </h1>
        <p className="text-muted">Acceso restringido solo para moderadores y administradores.</p>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", borderBottom: "1px solid var(--color-outline-variant)", marginBottom: "var(--space-xl)", paddingBottom: "var(--space-xs)" }}>
        {tabs.map(t => (
          <button 
            key={t.id}
            className={`btn ${activeTab === t.id ? "btn--primary" : "btn--ghost"}`}
            onClick={() => handleNav(t.id, t.path)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}
