import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminLayout from "@/components/admin/AdminLayout";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  
  // NOTE: En un futuro, deberíamos validar aquí si user.role === 'admin'
  // const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  // if (profile?.role !== 'admin') redirect('/dashboard');

  return (
    <AdminLayout>
      <div className="flex gap-md">
        <div className="card" style={{ flex: 1, borderTop: "4px solid var(--color-primary)" }}>
          <h3>Usuarios Totales</h3>
          <div style={{ fontSize: "3rem", fontWeight: "bold" }}>1,204</div>
          <span className="text-muted">+12 esta semana</span>
        </div>
        <div className="card" style={{ flex: 1, borderTop: "4px solid var(--color-secondary)" }}>
          <h3>Hilos Activos</h3>
          <div style={{ fontSize: "3rem", fontWeight: "bold" }}>342</div>
          <span className="text-muted">En las últimas 24h</span>
        </div>
        <div className="card" style={{ flex: 1, borderTop: "4px solid var(--color-warning)" }}>
          <h3>Reportes Moderación</h3>
          <div style={{ fontSize: "3rem", fontWeight: "bold", color: "var(--color-warning)" }}>5</div>
          <span className="text-muted">Pendientes de revisión</span>
        </div>
      </div>
    </AdminLayout>
  );
}
