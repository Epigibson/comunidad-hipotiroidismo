import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminChart from "@/components/admin/AdminChart";

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <AdminLayout>
      <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-md)" }}>
        <h3>Métricas de Plataforma</h3>
        <select className="input" style={{ width: "auto" }}>
          <option>Últimos 7 días</option>
          <option>Últimos 30 días</option>
          <option>Este año</option>
        </select>
      </div>

      <div className="flex gap-md" style={{ marginBottom: "var(--space-md)" }}>
        <div className="card" style={{ flex: 1 }}>
          <h4 style={{ color: "var(--color-on-surface-variant)" }}>Usuarios Activos (DAU)</h4>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>856</div>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <h4 style={{ color: "var(--color-on-surface-variant)" }}>Retención Día 7</h4>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>42%</div>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <h4 style={{ color: "var(--color-on-surface-variant)" }}>Síntomas Registrados</h4>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>14,502</div>
        </div>
      </div>

      <div className="card">
        <h4>Tendencia de Registros</h4>
        <AdminChart />
      </div>
    </AdminLayout>
  );
}
