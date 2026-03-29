import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database";

type DailyLog = Database["public"]["Tables"]["daily_logs"]["Row"];
type LabResult = Database["public"]["Tables"]["lab_results"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch today's log
  const today = new Date().toISOString().split("T")[0];
  const { data: todayLog } = (await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("log_date", today)
    .maybeSingle()) as { data: DailyLog | null };

  // Fetch streak (consecutive days with logs)
  const { data: recentLogs } = (await supabase
    .from("daily_logs")
    .select("log_date")
    .eq("user_id", user.id)
    .order("log_date", { ascending: false })
    .limit(30)) as { data: { log_date: string }[] | null };

  const logDates: string[] = recentLogs?.map((l) => l.log_date) ?? [];
  const streak = calculateStreak(logDates);

  // Fetch latest lab result
  const { data: latestLab } = (await supabase
    .from("lab_results")
    .select("tsh_level, test_date")
    .eq("user_id", user.id)
    .order("test_date", { ascending: false })
    .limit(1)
    .maybeSingle()) as {
    data: Pick<LabResult, "tsh_level" | "test_date"> | null;
  };

  // Fetch profile
  const { data: profile } = (await supabase
    .from("profiles")
    .select("alias")
    .eq("id", user.id)
    .single()) as { data: Pick<Profile, "alias"> | null };

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <h1 className="page-header__title">
          ¡Hola, {profile?.alias ?? "Mariposa"}! 🦋
        </h1>
        <p className="page-header__subtitle">
          {todayLog
            ? "Ya registraste cómo te sientes hoy. ¡Excelente!"
            : "¿Cómo te sientes hoy? Registra tus síntomas."}
        </p>
      </div>

      {/* Stats */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--primary">🔥</div>
          <div>
            <div className="stat-card__label">Racha</div>
            <div className="stat-card__value">
              {streak} {streak === 1 ? "día" : "días"}
            </div>
            <div className="stat-card__change stat-card__change--up">
              {streak >= 7 ? "🎉 ¡Gran constancia!" : "Sigue así 💪"}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--secondary">⚡</div>
          <div>
            <div className="stat-card__label">Energía hoy</div>
            <div className="stat-card__value">
              {todayLog?.energy_level
                ? `${todayLog.energy_level}/5`
                : "—"}
            </div>
            <div className="stat-card__change">
              {todayLog?.energy_level
                ? getEnergyLabel(todayLog.energy_level)
                : "Sin registro aún"}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--tertiary">🔬</div>
          <div>
            <div className="stat-card__label">Último TSH</div>
            <div className="stat-card__value">
              {latestLab?.tsh_level
                ? `${latestLab.tsh_level} mUI/L`
                : "—"}
            </div>
            <div className="stat-card__change">
              {latestLab?.test_date
                ? formatLabDate(latestLab.test_date)
                : "Sin resultados"}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2
        style={{
          fontSize: "var(--text-lg)",
          marginTop: "var(--space-xl)",
          marginBottom: "var(--space-md)",
        }}
      >
        Acciones rápidas
      </h2>
      <div className="quick-actions">
        <Link href="/tracker" className="quick-action">
          <span className="quick-action__icon">
            {todayLog ? "✏️" : "📝"}
          </span>
          {todayLog ? "Editar registro de hoy" : "Registrar cómo me siento"}
        </Link>
        <Link href="/labs" className="quick-action">
          <span className="quick-action__icon">🔬</span>
          Agregar resultado de lab
        </Link>
        <Link href="/community" className="quick-action">
          <span className="quick-action__icon">💬</span>
          Ir a la comunidad
        </Link>
        <Link href="/reports" className="quick-action">
          <span className="quick-action__icon">📊</span>
          Ver mis reportes
        </Link>
        <Link href="/knowledge" className="quick-action">
          <span className="quick-action__icon">📚</span>
          Biblioteca médica
        </Link>
        <Link href="/calm" className="quick-action">
          <span className="quick-action__icon">🧘‍♀️</span>
          Centro de Calma
        </Link>
      </div>
    </div>
  );
}

function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < dates.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    const expectedStr = expected.toISOString().split("T")[0];

    if (dates[i] === expectedStr) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function getEnergyLabel(level: number): string {
  const labels = ["", "🪫 Muy baja", "😴 Baja", "😐 Regular", "😊 Buena", "⚡ Excelente"];
  return labels[level] || "";
}

function formatLabDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-MX", { month: "short", day: "numeric", year: "numeric" });
}
