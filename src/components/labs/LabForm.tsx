"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/types/database";

interface LabFormProps {
  userId: string;
  onSaved: () => void;
  onCancel: () => void;
}

export default function LabForm({ userId, onSaved, onCancel }: LabFormProps) {
  const [testDate, setTestDate] = useState(new Date().toISOString().split("T")[0]);
  const [labName, setLabName] = useState("");
  const [tsh, setTsh] = useState("");
  const [t4Free, setT4Free] = useState("");
  const [t3Free, setT3Free] = useState("");
  const [t4Total, setT4Total] = useState("");
  const [t3Total, setT3Total] = useState("");
  const [antiTPO, setAntiTPO] = useState("");
  const [antiTg, setAntiTg] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!tsh && !t4Free && !t3Free) {
      setError("Ingresa al menos un valor (TSH, T4 o T3).");
      return;
    }

    setSaving(true);
    setError("");

    const supabase = createClient();

    const labData: Database["public"]["Tables"]["lab_results"]["Insert"] = {
      user_id: userId,
      test_date: testDate,
      lab_name: labName || null,
      tsh_level: tsh ? parseFloat(tsh) : null,
      t4_free: t4Free ? parseFloat(t4Free) : null,
      t3_free: t3Free ? parseFloat(t3Free) : null,
      t4_total: t4Total ? parseFloat(t4Total) : null,
      t3_total: t3Total ? parseFloat(t3Total) : null,
      anti_tpo: antiTPO ? parseFloat(antiTPO) : null,
      anti_tg: antiTg ? parseFloat(antiTg) : null,
      notes: notes || null,
    };

    const { error: dbError } = await supabase.from("lab_results").insert(labData as never);

    setSaving(false);

    if (dbError) {
      setError("Error: " + dbError.message);
    } else {
      onSaved();
    }
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">🔬 Nuevo Resultado</h2>
          <button className="modal__close" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <div className="tracker-row">
            <div className="input-group">
              <label className="input-label">Fecha del estudio</label>
              <input
                type="date"
                className="input"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Nombre del laboratorio</label>
              <input
                type="text"
                className="input"
                placeholder="Ej: Laboratorio Azteca"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
              />
            </div>
          </div>

          <h4 style={{ fontSize: "var(--text-sm)", color: "var(--color-primary)", marginTop: "var(--space-xs)" }}>
            📋 Perfil Tiroideo
          </h4>

          <div className="lab-form-grid">
            <div className="input-group">
              <label className="input-label">TSH (mUI/L)</label>
              <input type="number" step="0.001" className="input" placeholder="Ej: 2.5" value={tsh} onChange={(e) => setTsh(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">T4 Libre (ng/dL)</label>
              <input type="number" step="0.01" className="input" placeholder="Ej: 1.2" value={t4Free} onChange={(e) => setT4Free(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">T3 Libre (pg/mL)</label>
              <input type="number" step="0.01" className="input" placeholder="Ej: 3.1" value={t3Free} onChange={(e) => setT3Free(e.target.value)} />
            </div>
          </div>

          <h4 style={{ fontSize: "var(--text-sm)", color: "var(--color-secondary)", marginTop: "var(--space-xs)" }}>
            🦋 Anticuerpos (Hashimoto)
          </h4>

          <div className="lab-form-grid">
            <div className="input-group">
              <label className="input-label">Anti-TPO (UI/mL)</label>
              <input type="number" step="0.1" className="input" placeholder="Ej: 12.5" value={antiTPO} onChange={(e) => setAntiTPO(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Anti-Tg (UI/mL)</label>
              <input type="number" step="0.1" className="input" placeholder="Ej: 8.0" value={antiTg} onChange={(e) => setAntiTg(e.target.value)} />
            </div>
          </div>

          <h4 style={{ fontSize: "var(--text-sm)", color: "var(--color-outline)", marginTop: "var(--space-xs)" }}>
            📝 Valores adicionales (opcional)
          </h4>

          <div className="lab-form-grid">
            <div className="input-group">
              <label className="input-label">T4 Total (µg/dL)</label>
              <input type="number" step="0.01" className="input" placeholder="Opcional" value={t4Total} onChange={(e) => setT4Total(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">T3 Total (ng/dL)</label>
              <input type="number" step="0.01" className="input" placeholder="Opcional" value={t3Total} onChange={(e) => setT3Total(e.target.value)} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Notas</label>
            <textarea
              className="input"
              placeholder="Ej: Cambié dosis hace 6 semanas..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {error && (
            <div className="badge badge--error" style={{ padding: "var(--space-sm) var(--space-md)", fontSize: "var(--text-sm)" }}>
              ⚠️ {error}
            </div>
          )}

          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancelar</button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? "Guardando..." : "💾 Guardar resultado"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
