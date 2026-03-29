"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

const ENERGY_LABELS = ["", "🪫 Muy baja", "😴 Baja", "😐 Regular", "😊 Buena", "⚡ Excelente"];
const FOG_LABELS = ["", "🧠 Nada", "💭 Leve", "🌫️ Moderado", "😶‍🌫️ Alto", "🌪️ Severo"];
const MOOD_LABELS = ["", "😢 Muy bajo", "😕 Bajo", "😐 Neutro", "🙂 Bueno", "😄 Excelente"];
const PAIN_LABELS = ["", "✅ Sin dolor", "🟡 Leve", "🟠 Moderado", "🔴 Fuerte", "🚨 Severo"];

interface TrackerFormProps {
  initialData?: {
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
  } | null;
  userId: string;
  isEdit: boolean;
}

export default function TrackerForm({ initialData, userId, isEdit }: TrackerFormProps) {
  const [energy, setEnergy] = useState(initialData?.energy_level ?? 0);
  const [fog, setFog] = useState(initialData?.brain_fog_level ?? 0);
  const [mood, setMood] = useState(initialData?.mood_level ?? 0);
  const [pain, setPain] = useState(initialData?.joint_pain_level ?? 0);
  const [sleep, setSleep] = useState(initialData?.sleep_hours?.toString() ?? "");
  const [weight, setWeight] = useState(initialData?.weight_kg?.toString() ?? "");
  const [medTaken, setMedTaken] = useState(initialData?.medication_taken ?? false);
  const [medDose, setMedDose] = useState(initialData?.medication_dose_mcg?.toString() ?? "");
  const [medName, setMedName] = useState(initialData?.medication_name ?? "Levotiroxina");
  const [notes, setNotes] = useState(initialData?.custom_notes ?? "");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (energy === 0) {
      setError("Selecciona al menos tu nivel de energía");
      return;
    }

    setSaving(true);
    setError("");

    const supabase = createClient() as SupabaseClient<Database>;
    const today = new Date().toISOString().split("T")[0];

    const logData: Database["public"]["Tables"]["daily_logs"]["Insert"] = {
      user_id: userId,
      log_date: today,
      energy_level: energy || null,
      brain_fog_level: fog || null,
      mood_level: mood || null,
      joint_pain_level: pain || null,
      sleep_hours: sleep ? parseFloat(sleep) : null,
      weight_kg: weight ? parseFloat(weight) : null,
      medication_taken: medTaken,
      medication_dose_mcg: medDose ? parseFloat(medDose) : null,
      medication_name: medName || "Levotiroxina",
      custom_notes: notes || null,
    };

    const { error: dbError } = await supabase
      .from("daily_logs")
      .upsert(logData as never, { onConflict: "user_id,log_date" });

    setSaving(false);

    if (dbError) {
      setError("Error al guardar: " + dbError.message);
    } else {
      setSaved(true);
    }
  }

  if (saved) {
    return (
      <div className="tracker-success animate-fadeInUp">
        <div className="tracker-success__icon">🎉</div>
        <h2>¡Registrado!</h2>
        <p className="text-muted" style={{ marginTop: "var(--space-sm)", marginBottom: "var(--space-lg)" }}>
          Tu registro de hoy ha sido guardado exitosamente.
        </p>
        <div className="flex gap-sm justify-center">
          <button className="btn btn--primary" onClick={() => setSaved(false)}>
            Editar registro
          </button>
          <a href="/dashboard" className="btn btn--outline">
            Ir al Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="tracker-form">
      {/* Symptoms */}
      <div className="tracker-section">
        <h3 className="tracker-section__title">💜 ¿Cómo te sientes hoy?</h3>

        <LikertRow label="Nivel de energía" value={energy} onChange={setEnergy} labels={ENERGY_LABELS} emojis={["🪫", "😴", "😐", "😊", "⚡"]} />
        <LikertRow label="Niebla mental" value={fog} onChange={setFog} labels={FOG_LABELS} emojis={["🧠", "💭", "🌫️", "😶‍🌫️", "🌪️"]} />
        <LikertRow label="Estado de ánimo" value={mood} onChange={setMood} labels={MOOD_LABELS} emojis={["😢", "😕", "😐", "🙂", "😄"]} />
        <LikertRow label="Dolor articular" value={pain} onChange={setPain} labels={PAIN_LABELS} emojis={["✅", "🟡", "🟠", "🔴", "🚨"]} />
      </div>

      {/* Sleep & Weight */}
      <div className="tracker-section">
        <h3 className="tracker-section__title">😴 Sueño y cuerpo</h3>
        <div className="tracker-row">
          <div className="input-group">
            <label className="input-label">Horas de sueño</label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="24"
              className="input"
              placeholder="Ej: 7.5"
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Peso (kg) — opcional</label>
            <input
              type="number"
              step="0.1"
              min="20"
              max="300"
              className="input"
              placeholder="Ej: 65.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Medication */}
      <div className="tracker-section">
        <h3 className="tracker-section__title">💊 Medicación</h3>

        <label className="medication-toggle" onClick={() => setMedTaken(!medTaken)}>
          <div className={`medication-toggle__switch ${medTaken ? "medication-toggle__switch--active" : ""}`} />
          <div>
            <div style={{ fontWeight: "var(--weight-medium)" }}>
              {medTaken ? "✅ Tomé mi medicamento hoy" : "¿Tomaste tu medicamento hoy?"}
            </div>
            <div className="text-xs text-muted">Registra si tomaste tu levotiroxina</div>
          </div>
        </label>

        {medTaken && (
          <div className="tracker-row" style={{ marginTop: "var(--space-md)" }}>
            <div className="input-group">
              <label className="input-label">Nombre del medicamento</label>
              <input
                type="text"
                className="input"
                placeholder="Levotiroxina"
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Dosis (mcg)</label>
              <input
                type="number"
                step="0.5"
                className="input"
                placeholder="Ej: 75"
                value={medDose}
                onChange={(e) => setMedDose(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="tracker-section">
        <h3 className="tracker-section__title">📝 Notas del día</h3>
        <div className="input-group">
          <textarea
            className="input"
            placeholder="¿Algo más que quieras recordar? (opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {error && (
        <div className="badge badge--error" style={{ padding: "var(--space-sm) var(--space-md)", fontSize: "var(--text-sm)" }}>
          ⚠️ {error}
        </div>
      )}

      <button type="submit" className="btn btn--primary btn--lg" disabled={saving} style={{ width: "100%" }}>
        {saving ? "Guardando..." : isEdit ? "✏️ Actualizar registro" : "💜 Guardar registro de hoy"}
      </button>
    </form>
  );
}

function LikertRow({ label, value, onChange, labels, emojis }: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  labels: string[];
  emojis: string[];
}) {
  return (
    <div className="likert-row">
      <div className="likert-row__label">{label}</div>
      <div className="likert">
        {emojis.map((emoji, i) => (
          <button
            key={i}
            type="button"
            className={`likert__option ${value === i + 1 ? "likert__option--active" : ""}`}
            onClick={() => onChange(i + 1)}
            title={labels[i + 1]}
          >
            {emoji}
          </button>
        ))}
      </div>
      <div className="likert-row__value">{value > 0 ? labels[value] : ""}</div>
    </div>
  );
}
