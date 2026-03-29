"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Database } from "@/lib/types/database";

interface ProfileData {
  alias: string;
  avatar_url: string | null;
  date_of_birth: string | null;
  gender: string | null;
  role: string;
  created_at: string;
}

interface HealthCondition {
  id: string;
  condition_name: string;
  diagnosed_date: string | null;
}

interface ProfileClientProps {
  profile: ProfileData;
  conditions: HealthCondition[];
  userId: string;
  email: string;
}

const AVAILABLE_CONDITIONS = [
  "Hipotiroidismo",
  "Tiroiditis de Hashimoto",
  "SOP (Síndrome de Ovario Poliquístico)",
  "Hipertiroidismo",
  "Nódulos tiroideos",
  "Tiroiditis postparto",
  "Resistencia a la insulina",
  "Deficiencia de vitamina D",
  "Anemia",
  "Otro",
];

export default function ProfileClient({ profile, conditions, userId, email }: ProfileClientProps) {
  const router = useRouter();
  const [alias, setAlias] = useState(profile.alias);
  const [dob, setDob] = useState(profile.date_of_birth ?? "");
  const [gender, setGender] = useState(profile.gender ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [condList, setCondList] = useState(conditions);
  const [showAddCondition, setShowAddCondition] = useState(false);
  const [newCondition, setNewCondition] = useState("");
  const [newCondDate, setNewCondDate] = useState("");
  const [addingCond, setAddingCond] = useState(false);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    if (!alias.trim()) {
      setError("El alias es requerido.");
      return;
    }

    setSaving(true);
    setError("");

    const supabase = createClient();
    const profileUpdate: Database["public"]["Tables"]["profiles"]["Update"] = {
      alias: alias.trim(),
      date_of_birth: dob || null,
      gender: gender || null,
    };

    const { error: dbError } = await supabase
      .from("profiles")
      .update(profileUpdate as never)
      .eq("id", userId);

    setSaving(false);

    if (dbError) {
      setError("Error: " + dbError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  async function handleAddCondition(e: React.FormEvent) {
    e.preventDefault();
    if (!newCondition) return;

    setAddingCond(true);
    const supabase = createClient();

    const conditionInsert: Database["public"]["Tables"]["health_conditions"]["Insert"] = {
      user_id: userId,
      condition_name: newCondition,
      diagnosis_date: newCondDate || null,
      condition_type: "other", // Default as per available UI list mapping simplicity
    };

    const { data, error } = (await supabase
      .from("health_conditions")
      .insert(conditionInsert as never)
      .select("id, condition_name, diagnosis_date")
      .single()) as { data: HealthCondition | null; error: unknown };

    setAddingCond(false);

    if (data) {
      setCondList([...condList, data]);
      setNewCondition("");
      setNewCondDate("");
      setShowAddCondition(false);
    }
  }

  async function handleRemoveCondition(id: string) {
    const supabase = createClient();
    await supabase.from("health_conditions").delete().eq("id", id);
    setCondList(condList.filter((c) => c.id !== id));
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const memberSince = new Date(profile.created_at).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
  });

  return (
    <>
      <div className="page-header">
        <h1 className="page-header__title">Mi Perfil 👤</h1>
        <p className="page-header__subtitle">Administra tu información y preferencias.</p>
      </div>

      {/* Profile header card */}
      <div className="profile-header">
        <div className="profile-header__avatar">
          {alias.charAt(0).toUpperCase()}
        </div>
        <div className="profile-header__info">
          <h2>🦋 {alias}</h2>
          <p className="text-muted">{email}</p>
          <p className="text-xs text-muted">Miembro desde {memberSince} · {profile.role}</p>
        </div>
      </div>

      <div className="profile-sections">
        {/* Personal info */}
        <div className="profile-section">
          <h3 className="profile-section__title">📝 Información personal</h3>
          <form onSubmit={handleProfileSave} className="flex flex-col gap-md">
            <div className="profile-form-row">
              <div className="input-group">
                <label className="input-label">Alias / Seudónimo</label>
                <input
                  type="text"
                  className="input"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  required
                />
                <span className="input-helper">Este nombre será visible en la comunidad</span>
              </div>
              <div className="input-group">
                <label className="input-label">Email</label>
                <input
                  type="email"
                  className="input"
                  value={email}
                  disabled
                  style={{ opacity: 0.6 }}
                />
                <span className="input-helper">No se puede cambiar por seguridad</span>
              </div>
            </div>

            <div className="profile-form-row">
              <div className="input-group">
                <label className="input-label">Fecha de nacimiento (opcional)</label>
                <input
                  type="date"
                  className="input"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Género (opcional)</label>
                <select
                  className="input"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Prefiero no decir</option>
                  <option value="female">Femenino</option>
                  <option value="male">Masculino</option>
                  <option value="non-binary">No binario</option>
                  <option value="other">Otro</option>
                </select>
              </div>
            </div>

            {error && <p className="text-error text-sm">⚠️ {error}</p>}

            <div className="flex gap-sm items-center">
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? "Guardando..." : "💾 Guardar cambios"}
              </button>
              {saved && <span className="badge badge--success">✅ Guardado</span>}
            </div>
          </form>
        </div>

        {/* Health conditions */}
        <div className="profile-section">
          <h3 className="profile-section__title">🦋 Mis condiciones de salud</h3>

          {condList.length > 0 && (
            <div className="condition-chips">
              {condList.map((c) => (
                <div key={c.id} className="condition-chip">
                  {c.condition_name}
                  {c.diagnosed_date && (
                    <span className="text-xs" style={{ opacity: 0.7 }}>
                      ({new Date(c.diagnosed_date + "T12:00:00").getFullYear()})
                    </span>
                  )}
                  <button
                    onClick={() => handleRemoveCondition(c.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "var(--text-sm)", padding: "0 2px" }}
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {showAddCondition ? (
            <form onSubmit={handleAddCondition} className="flex flex-col gap-sm" style={{ marginTop: "var(--space-sm)" }}>
              <div className="profile-form-row">
                <div className="input-group">
                  <label className="input-label">Condición</label>
                  <select className="input" value={newCondition} onChange={(e) => setNewCondition(e.target.value)} required>
                    <option value="">Seleccionar...</option>
                    {AVAILABLE_CONDITIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Fecha de diagnóstico (opcional)</label>
                  <input type="date" className="input" value={newCondDate} onChange={(e) => setNewCondDate(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-sm">
                <button type="submit" className="btn btn--primary btn--sm" disabled={addingCond}>
                  {addingCond ? "..." : "Agregar"}
                </button>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setShowAddCondition(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <button className="btn btn--outline btn--sm" onClick={() => setShowAddCondition(true)}>
              ➕ Agregar condición
            </button>
          )}
        </div>

        {/* Account actions */}
        <div className="profile-section">
          <h3 className="profile-section__title">⚙️ Cuenta</h3>
          <div className="flex flex-col gap-md" style={{ alignItems: 'flex-start' }}>
            <Link href="/profile/2fa" className="btn btn--secondary">
              🛡️ Configurar Verificación 2FA
            </Link>
            <button className="btn btn--outline" onClick={handleLogout}>
              🚪 Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
