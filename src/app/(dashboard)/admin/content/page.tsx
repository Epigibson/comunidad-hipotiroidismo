import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminLayout from "@/components/admin/AdminLayout";

export default async function AdminContentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <AdminLayout>
      <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-md)" }}>
        <h3>Biblioteca de Conocimiento (CMS)</h3>
        <button className="btn btn--primary">
          📝 Escribir nuevo artículo
        </button>
      </div>

      <div className="card" style={{ padding: "0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--color-surface-container-high)" }}>
              <th style={{ padding: "var(--space-sm) var(--space-md)" }}>Título</th>
              <th style={{ padding: "var(--space-sm) var(--space-md)" }}>Categoría</th>
              <th style={{ padding: "var(--space-sm) var(--space-md)" }}>Estado</th>
              <th style={{ padding: "var(--space-sm) var(--space-md)" }}>Fecha</th>
              <th style={{ padding: "var(--space-sm) var(--space-md)", textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderTop: "1px solid var(--color-outline-variant)" }}>
              <td style={{ padding: "var(--space-sm) var(--space-md)" }}>Hipertiroidismo postparto</td>
              <td style={{ padding: "var(--space-sm) var(--space-md)" }}>🦋 Tiroides</td>
              <td style={{ padding: "var(--space-sm) var(--space-md)" }}>
                <span style={{ background: "var(--color-secondary-container)", color: "var(--color-on-secondary-container)", padding: "2px 8px", borderRadius: "100px", fontSize: "0.8rem" }}>
                  Publicado
                </span>
              </td>
              <td style={{ padding: "var(--space-sm) var(--space-md)" }}>24/11/2024</td>
              <td style={{ padding: "var(--space-sm) var(--space-md)", textAlign: "right" }}>
                <button className="btn btn--ghost btn--sm">Editar</button>
              </td>
            </tr>
            <tr style={{ borderTop: "1px solid var(--color-outline-variant)" }}>
              <td style={{ padding: "var(--space-sm) var(--space-md)" }}>Recetas sin TACC</td>
              <td style={{ padding: "var(--space-sm) var(--space-md)" }}>🥗 Nutrición</td>
              <td style={{ padding: "var(--space-sm) var(--space-md)" }}>
                <span style={{ background: "var(--color-warning-container)", color: "var(--color-on-warning-container)", padding: "2px 8px", borderRadius: "100px", fontSize: "0.8rem" }}>
                  Borrador
                </span>
              </td>
              <td style={{ padding: "var(--space-sm) var(--space-md)" }}>--</td>
              <td style={{ padding: "var(--space-sm) var(--space-md)", textAlign: "right" }}>
                <button className="btn btn--ghost btn--sm">Editar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
