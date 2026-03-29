"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/types/database";

const DIAGNOSES = [
  { id: "hypothyroidism", label: "Hipotiroidismo", icon: "🦋" },
  { id: "hashimoto", label: "Tiroiditis de Hashimoto", icon: "🔬" },
  { id: "pcos", label: "SOP / Ovario Poliquístico", icon: "🌸" },
  { id: "hyperthyroidism", label: "Hipertiroidismo", icon: "⚡" },
  { id: "nodules", label: "Nódulos tiroideos", icon: "🔍" },
  { id: "postpartum", label: "Tiroiditis postparto", icon: "👶" },
  { id: "insulin", label: "Resistencia a la insulina", icon: "🩸" },
  { id: "other", label: "Otro / No diagnosticado", icon: "❓" },
];

const SYMPTOMS = [
  { id: "fatigue", label: "Fatiga / Cansancio", icon: "😴" },
  { id: "brain_fog", label: "Niebla mental", icon: "🌫️" },
  { id: "weight", label: "Cambios de peso", icon: "⚖️" },
  { id: "hair_loss", label: "Caída de cabello", icon: "💇" },
  { id: "cold", label: "Intolerancia al frío", icon: "🥶" },
  { id: "mood", label: "Cambios de ánimo", icon: "😕" },
  { id: "joint_pain", label: "Dolor articular", icon: "🦴" },
  { id: "dry_skin", label: "Piel seca", icon: "🧴" },
  { id: "constipation", label: "Estreñimiento", icon: "🫃" },
  { id: "sleep", label: "Problemas de sueño", icon: "🛏️" },
  { id: "anxiety", label: "Ansiedad", icon: "😰" },
  { id: "heart", label: "Palpitaciones", icon: "💓" },
];

export default function OnboardingWizard({ userId }: { userId: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>([]);
  const [diagDate, setDiagDate] = useState("");
  const [medName, setMedName] = useState("Levotiroxina");
  const [medDose, setMedDose] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function toggleDiagnosis(id: string) {
    setSelectedDiagnoses((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  }

  function toggleSymptom(id: string) {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  async function handleFinish() {
    setSaving(true);
    const supabase = createClient();

    // Save health conditions
    for (const diagId of selectedDiagnoses) {
      const diag = DIAGNOSES.find((d) => d.id === diagId);
      if (diag) {
        const conditionData: Database["public"]["Tables"]["health_conditions"]["Insert"] = {
          user_id: userId,
          condition_name: diag.label,
          condition_type: diag.id as any,
          diagnosis_date: diagDate || null,
        };
        await supabase.from("health_conditions").insert(conditionData as never);
      }
    }

    // Finish onboarding
    setSaving(false);
    router.push("/dashboard");
  }

  const totalSteps = 4;

  return (
    <div className="onboarding-layout">
      <div className="onboarding-card">
        {/* Progress */}
        <div className="onboarding-progress">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`onboarding-progress__step ${
                i < step ? "onboarding-progress__step--done" : i === step ? "onboarding-progress__step--active" : ""
              }`}
            />
          ))}
        </div>

        {/* Step 0: Welcome */}
        {step === 0 && (
          <>
            <div className="onboarding-icon">🦋</div>
            <h1 className="onboarding-title">¡Bienvenida a TiroVida!</h1>
            <p className="onboarding-subtitle">
              Vamos a personalizar tu experiencia en unos pocos pasos.
              Tu información es privada y solo tú podrás verla.
            </p>
            <div style={{ textAlign: "center" }}>
              <button className="btn btn--primary btn--lg" onClick={() => setStep(1)} style={{ width: "100%" }}>
                Comenzar 💜
              </button>
              <button className="btn btn--ghost" onClick={() => router.push("/dashboard")} style={{ marginTop: "var(--space-sm)" }}>
                Omitir por ahora
              </button>
            </div>
          </>
        )}

        {/* Step 1: Diagnosis */}
        {step === 1 && (
          <>
            <div className="onboarding-icon">🔬</div>
            <h2 className="onboarding-title">Tu diagnóstico</h2>
            <p className="onboarding-subtitle">
              ¿Qué condiciones te han diagnosticado? Puedes seleccionar varias.
            </p>
            <div className="condition-select-grid">
              {DIAGNOSES.map((d) => (
                <button
                  key={d.id}
                  className={`condition-select-btn ${selectedDiagnoses.includes(d.id) ? "condition-select-btn--active" : ""}`}
                  onClick={() => toggleDiagnosis(d.id)}
                >
                  {d.icon} {d.label}
                </button>
              ))}
            </div>
            <div className="onboarding-nav">
              <button className="btn btn--ghost" onClick={() => setStep(0)}>← Atrás</button>
              <button className="btn btn--primary" onClick={() => setStep(2)}>
                Siguiente →
              </button>
            </div>
          </>
        )}

        {/* Step 2: Diagnosis Date + Medication */}
        {step === 2 && (
          <>
            <div className="onboarding-icon">📅</div>
            <h2 className="onboarding-title">Detalles del diagnóstico</h2>
            <p className="onboarding-subtitle">
              Esta información nos ayuda a contextualizar tus datos.
            </p>
            <div className="flex flex-col gap-md">
              <div className="input-group">
                <label className="input-label">¿Cuándo te diagnosticaron? (aproximado)</label>
                <input
                  type="date"
                  className="input"
                  value={diagDate}
                  onChange={(e) => setDiagDate(e.target.value)}
                />
                <span className="input-helper">No te preocupes si no recuerdas la fecha exacta</span>
              </div>
              <div className="input-group">
                <label className="input-label">Medicamento actual</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Ej: Levotiroxina"
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
            <div className="onboarding-nav">
              <button className="btn btn--ghost" onClick={() => setStep(1)}>← Atrás</button>
              <button className="btn btn--primary" onClick={() => setStep(3)}>
                Siguiente →
              </button>
            </div>
          </>
        )}

        {/* Step 3: Symptoms */}
        {step === 3 && (
          <>
            <div className="onboarding-icon">📋</div>
            <h2 className="onboarding-title">Tus síntomas</h2>
            <p className="onboarding-subtitle">
              ¿Cuáles de estos síntomas experimentas frecuentemente?
            </p>
            <div className="symptom-check-grid">
              {SYMPTOMS.map((s) => (
                <label
                  key={s.id}
                  className={`symptom-check ${selectedSymptoms.includes(s.id) ? "symptom-check--active" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(s.id)}
                    onChange={() => toggleSymptom(s.id)}
                  />
                  {s.icon} {s.label}
                </label>
              ))}
            </div>
            <div className="onboarding-nav">
              <button className="btn btn--ghost" onClick={() => setStep(2)}>← Atrás</button>
              <button className="btn btn--primary" onClick={handleFinish} disabled={saving}>
                {saving ? "Guardando..." : "¡Listo! 🎉"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
