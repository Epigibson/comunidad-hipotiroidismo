import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TrackerForm from "@/components/tracker/TrackerForm";

export default async function TrackerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = new Date().toISOString().split("T")[0];

  const { data: todayLog } = (await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("log_date", today)
    .maybeSingle()) as { data: Record<string, unknown> | null };

  const isEdit = !!todayLog;

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <h1 className="page-header__title">
          {isEdit ? "Editar Registro 📝" : "Registro Diario 📝"}
        </h1>
        <p className="page-header__subtitle">
          {isEdit
            ? "Ya registraste hoy. Puedes editar tu registro si algo cambió."
            : "¿Cómo te sientes hoy? Registra tus síntomas para llevar un seguimiento."}
        </p>
        {isEdit && (
          <span className="badge badge--success" style={{ marginTop: "var(--space-sm)" }}>
            ✅ Registro de hoy guardado
          </span>
        )}
      </div>

      <TrackerForm
        initialData={todayLog as TrackerFormProps | null}
        userId={user.id}
        isEdit={isEdit}
      />
    </div>
  );
}

type TrackerFormProps = {
  energy_level?: number;
  brain_fog_level?: number;
  mood_level?: number;
  joint_pain_level?: number;
  sleep_hours?: number;
  weight_kg?: number;
  medication_taken?: boolean;
  medication_dose_mcg?: number;
  medication_name?: string;
  custom_notes?: string;
};
