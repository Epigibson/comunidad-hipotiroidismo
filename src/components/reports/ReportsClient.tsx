"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface DailyLog {
  log_date: string;
  energy_level: number | null;
  brain_fog_level: number | null;
  mood_level: number | null;
  joint_pain_level: number | null;
  sleep_hours: number | null;
  medication_taken: boolean;
}

interface LabResult {
  test_date: string;
  tsh_level: number | null;
  t4_free_level: number | null;
  t3_free_level: number | null;
}

const PERIODS = [
  { label: "7 días", days: 7 },
  { label: "30 días", days: 30 },
  { label: "60 días", days: 60 },
  { label: "90 días", days: 90 },
];

export default function ReportsClient({ userId }: { userId: string }) {
  const [period, setPeriod] = useState(30);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [labs, setLabs] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [period]);

  async function loadData() {
    setLoading(true);
    const supabase = createClient();
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - period);
    const since = sinceDate.toISOString().split("T")[0];

    const [logsRes, labsRes] = await Promise.all([
      supabase
        .from("daily_logs")
        .select("log_date, energy_level, brain_fog_level, mood_level, joint_pain_level, sleep_hours, medication_taken")
        .eq("user_id", userId)
        .gte("log_date", since)
        .order("log_date", { ascending: true }),
      supabase
        .from("lab_results")
        .select("test_date, tsh_level, t4_free_level, t3_free_level")
        .eq("user_id", userId)
        .gte("test_date", since)
        .order("test_date", { ascending: true }),
    ]);

    setLogs((logsRes.data as unknown as DailyLog[]) ?? []);
    setLabs((labsRes.data as unknown as LabResult[]) ?? []);
    setLoading(false);
  }

  const avg = (arr: (number | null)[]): string => {
    const valid = arr.filter((v): v is number => v != null);
    if (!valid.length) return "—";
    return (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1);
  };

  const avgEnergy = avg(logs.map((l) => l.energy_level));
  const avgFog = avg(logs.map((l) => l.brain_fog_level));
  const avgMood = avg(logs.map((l) => l.mood_level));
  const avgPain = avg(logs.map((l) => l.joint_pain_level));
  const avgSleep = avg(logs.map((l) => l.sleep_hours));
  const medAdherence = logs.length > 0
    ? Math.round((logs.filter((l) => l.medication_taken).length / logs.length) * 100) + "%"
    : "—";

  const latestTSH = labs.length > 0 ? labs[labs.length - 1] : null;

  // Build chart data: last N bar groups
  const chartLogs = logs.slice(-14).map(log => ({
    ...log,
    displayDate: new Date(log.log_date + "T12:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "short" })
  }));

  const chartLabs = labs.map(lab => ({
    ...lab,
    displayDate: new Date(lab.test_date + "T12:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "short" })
  }));

  return (
    <>
      <div className="page-header">
        <h1 className="page-header__title">Reportes 📊</h1>
        <p className="page-header__subtitle">
          Correlación de síntomas y laboratorios. Genera un resumen para tu endocrinólogo.
        </p>
      </div>

      {/* Period selector */}
      <div className="report-period-selector">
        {PERIODS.map((p) => (
          <button
            key={p.days}
            className={`period-btn ${period === p.days ? "period-btn--active" : ""}`}
            onClick={() => setPeriod(p.days)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card p-xl text-center text-muted">Cargando datos...</div>
      ) : logs.length === 0 && labs.length === 0 ? (
        <div className="card">
          <div className="lab-empty">
            <div className="lab-empty__icon">📊</div>
            <h3>Sin datos para generar reporte</h3>
            <p className="text-muted" style={{ marginTop: "var(--space-sm)", marginBottom: "var(--space-lg)" }}>
              Comienza registrando tus síntomas diarios y resultados de laboratorio.
            </p>
            <div className="flex gap-sm justify-center">
              <a href="/tracker" className="btn btn--primary">📝 Ir al Tracker</a>
              <a href="/labs" className="btn btn--outline">🔬 Ir a Labs</a>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="report-summary">
            <div className="report-stat">
              <div className="report-stat__label">⚡ Energía promedio</div>
              <div className="report-stat__value">{avgEnergy}</div>
              <div className="report-stat__detail">de 5.0</div>
            </div>
            <div className="report-stat">
              <div className="report-stat__label">🌫️ Niebla mental</div>
              <div className="report-stat__value">{avgFog}</div>
              <div className="report-stat__detail">de 5.0 (menor es mejor)</div>
            </div>
            <div className="report-stat">
              <div className="report-stat__label">😊 Ánimo promedio</div>
              <div className="report-stat__value">{avgMood}</div>
              <div className="report-stat__detail">de 5.0</div>
            </div>
            <div className="report-stat">
              <div className="report-stat__label">🦴 Dolor articular</div>
              <div className="report-stat__value">{avgPain}</div>
              <div className="report-stat__detail">de 5.0 (menor es mejor)</div>
            </div>
            <div className="report-stat">
              <div className="report-stat__label">😴 Horas de sueño</div>
              <div className="report-stat__value">{avgSleep}</div>
              <div className="report-stat__detail">promedio</div>
            </div>
            <div className="report-stat">
              <div className="report-stat__label">💊 Adherencia med.</div>
              <div className="report-stat__value">{medAdherence}</div>
              <div className="report-stat__detail">de {logs.length} días</div>
            </div>
          </div>

          {/* Chart: Symptom trend */}
          <div className="report-chart" style={{ padding: "var(--space-md)" }}>
            <div className="report-chart__title" style={{ marginBottom: "var(--space-md)" }}>
              📈 Tendencia de síntomas (últimos {chartLogs.length} registros)
            </div>
            {chartLogs.length > 0 ? (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartLogs} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="displayDate" tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} domain={[0, 5]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-surface-container)" }}
                      itemStyle={{ color: "var(--color-text)" }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                    <Bar dataKey="energy_level" name="Energía" fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="brain_fog_level" name="Niebla Mental" fill="var(--color-warning)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="mood_level" name="Ánimo" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="joint_pain_level" name="Dolor Articular" fill="var(--color-error)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="chart-placeholder">
                <span style={{ fontSize: "2rem" }}>📊</span>
                <p className="text-muted">Registra más días para ver la gráfica</p>
              </div>
            )}
          </div>

          {/* Lab results */}
          {labs.length > 0 && (
            <div className="report-chart" style={{ padding: "var(--space-md)", marginTop: "var(--space-lg)" }}>
              <div className="report-chart__title" style={{ marginBottom: "var(--space-md)" }}>
                🔬 Tendencia de Perfil Tiroideo (TSH y T4 Libre)
              </div>
              
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartLabs} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="displayDate" tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-surface-container)" }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                    <Line type="monotone" dataKey="tsh_level" name="TSH (mUI/L)" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} connectNulls />
                    <Line type="monotone" dataKey="t4_free_level" name="T4L (ng/dL)" stroke="var(--color-success)" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="labs-grid" style={{ marginTop: "var(--space-xl)" }}>
                {labs.map((lab, i) => (
                  <div key={i} style={{ padding: "var(--space-md)", background: "var(--color-surface-container)", borderRadius: "var(--radius-lg)" }}>
                    <div className="text-sm font-semibold" style={{ marginBottom: "var(--space-xs)" }}>
                      📅 {new Date(lab.test_date + "T12:00:00").toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
                    </div>
                    <div className="flex gap-md flex-wrap">
                      {lab.tsh_level != null && (
                        <div>
                          <span className="text-xs text-muted">TSH: </span>
                          <span className="font-bold" style={{ color: lab.tsh_level > 4 ? "var(--color-warning)" : "var(--color-success)" }}>
                            {lab.tsh_level} mUI/L
                          </span>
                        </div>
                      )}
                      {lab.t4_free_level != null && (
                        <div>
                          <span className="text-xs text-muted">T4L: </span>
                          <span className="font-bold">{lab.t4_free_level} ng/dL</span>
                        </div>
                      )}
                      {lab.t3_free_level != null && (
                        <div>
                          <span className="text-xs text-muted">T3L: </span>
                          <span className="font-bold">{lab.t3_free_level} pg/mL</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="card" style={{ marginTop: "var(--space-lg)", textAlign: "center" }}>
            <p className="text-sm text-muted">
              💡 <strong>Tip:</strong> Puedes usar una captura de pantalla o imprimir esta página (Ctrl+P) para compartir este reporte con tu endocrinólogo.
            </p>
          </div>
        </>
      )}
    </>
  );
}
