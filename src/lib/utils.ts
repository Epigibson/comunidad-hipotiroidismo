import { clsx, type ClassValue } from "clsx";

/**
 * Merge class names conditionally
 * Usage: cn("base-class", condition && "optional-class", "always-class")
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Format a date for display in Spanish
 */
export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

/**
 * Format a relative time (e.g., "hace 5 minutos")
 */
export function timeAgo(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "hace un momento";
  if (diffMin < 60) return `hace ${diffMin} min`;
  if (diffHour < 24) return `hace ${diffHour}h`;
  if (diffDay < 7) return `hace ${diffDay}d`;
  return formatDate(d, { month: "short", day: "numeric" });
}

/**
 * Likert scale labels for symptom tracking
 */
export const LIKERT_LABELS: Record<string, string[]> = {
  energy: ["🪫 Muy baja", "😴 Baja", "😐 Regular", "😊 Buena", "⚡ Excelente"],
  brain_fog: ["🧠 Nada", "💭 Leve", "🌫️ Moderado", "😶‍🌫️ Alto", "🌪️ Severo"],
  mood: ["😢 Muy bajo", "😕 Bajo", "😐 Neutro", "🙂 Bueno", "😄 Excelente"],
  joint_pain: ["✅ Sin dolor", "🟡 Leve", "🟠 Moderado", "🔴 Fuerte", "🚨 Severo"],
};

/**
 * TSH reference ranges for visual indicators
 */
export const TSH_RANGES = {
  low: { min: 0, max: 0.4, label: "Bajo", color: "var(--color-warning)" },
  normal: { min: 0.4, max: 4.0, label: "Normal", color: "var(--color-success)" },
  high: { min: 4.0, max: 10.0, label: "Elevado", color: "var(--color-warning)" },
  veryHigh: { min: 10.0, max: Infinity, label: "Muy elevado", color: "var(--color-error)" },
};

/**
 * Get TSH status based on value
 */
export function getTSHStatus(value: number) {
  if (value < TSH_RANGES.low.max) return TSH_RANGES.low;
  if (value <= TSH_RANGES.normal.max) return TSH_RANGES.normal;
  if (value <= TSH_RANGES.high.max) return TSH_RANGES.high;
  return TSH_RANGES.veryHigh;
}
