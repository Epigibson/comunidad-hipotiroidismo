"use client";

import { useState } from "react";
import LabForm from "@/components/labs/LabForm";

interface LabResult {
  id: string;
  test_date: string;
  lab_name: string | null;
  tsh_level: number | null;
  t4_free_level: number | null;
  t3_free_level: number | null;
  anti_tpo_level: number | null;
  anti_tg_level: number | null;
  notes: string | null;
}

function getTshStatus(tsh: number): string {
  if (tsh < 0.4) return "warning";
  if (tsh <= 4.0) return "normal";
  if (tsh <= 10.0) return "warning";
  return "danger";
}

function formatDate(d: string): string {
  return new Date(d + "T12:00:00").toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function LabsList({ labs, userId }: { labs: LabResult[]; userId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [list, setList] = useState(labs);

  function handleSaved() {
    setShowForm(false);
    // Reload page to get fresh data
    window.location.reload();
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-header__title">Laboratorios 🔬</h1>
        <p className="page-header__subtitle">
          Registra y visualiza tus resultados de perfil tiroideo.
        </p>
        <div className="page-header__actions">
          <button className="btn btn--primary" onClick={() => setShowForm(true)}>
            ➕ Agregar resultado
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="card">
          <div className="lab-empty">
            <div className="lab-empty__icon">🔬</div>
            <h3>Sin resultados aún</h3>
            <p className="text-muted" style={{ marginTop: "var(--space-sm)", marginBottom: "var(--space-lg)" }}>
              Agrega tu primer resultado de laboratorio para comenzar a visualizar tendencias.
            </p>
            <button className="btn btn--primary" onClick={() => setShowForm(true)}>
              ➕ Agregar mi primer resultado
            </button>
          </div>
        </div>
      ) : (
        <div className="labs-grid">
          {list.map((lab) => (
            <div key={lab.id} className="lab-card">
              <div className="lab-card__header">
                <div>
                  <div className="lab-card__date">📅 {formatDate(lab.test_date)}</div>
                  {lab.lab_name && <div className="lab-card__lab-name">🏥 {lab.lab_name}</div>}
                </div>
                {lab.tsh_level && (
                  <span className={`badge badge--${getTshStatus(lab.tsh_level) === "normal" ? "success" : getTshStatus(lab.tsh_level) === "warning" ? "warning" : "error"}`}>
                    TSH {getTshStatus(lab.tsh_level) === "normal" ? "✅" : "⚠️"}
                  </span>
                )}
              </div>

              <div className="lab-card__values">
                {lab.tsh_level != null && (
                  <div className={`lab-value lab-value--${getTshStatus(lab.tsh_level)}`}>
                    <span className="lab-value__label">TSH</span>
                    <span className="lab-value__number">{lab.tsh_level} mUI/L</span>
                  </div>
                )}
                {lab.t4_free_level != null && (
                  <div className="lab-value">
                    <span className="lab-value__label">T4 Libre</span>
                    <span className="lab-value__number" style={{ color: "var(--color-secondary)" }}>{lab.t4_free_level} ng/dL</span>
                  </div>
                )}
                {lab.t3_free_level != null && (
                  <div className="lab-value">
                    <span className="lab-value__label">T3 Libre</span>
                    <span className="lab-value__number" style={{ color: "var(--color-tertiary)" }}>{lab.t3_free_level} pg/mL</span>
                  </div>
                )}
                {lab.anti_tpo_level != null && (
                  <div className="lab-value">
                    <span className="lab-value__label">Anti-TPO</span>
                    <span className="lab-value__number">{lab.anti_tpo_level} UI/mL</span>
                  </div>
                )}
              </div>

              {lab.notes && (
                <p className="text-muted text-xs" style={{ marginTop: "var(--space-sm)" }}>
                  📝 {lab.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <LabForm userId={userId} onSaved={handleSaved} onCancel={() => setShowForm(false)} />
      )}
    </>
  );
}
