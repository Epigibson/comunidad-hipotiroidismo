"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/types/database";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  has_trigger_warning: boolean;
  trigger_warning_text: string | null;
}

interface Thread {
  id: string;
  title: string;
  content: string;
  is_anonymous: boolean;
  is_pinned: boolean;
  is_locked: boolean;
  reply_count: number;
  created_at: string;
  profiles: { alias: string } | null;
}

interface CommunityClientProps {
  categories: Category[];
  userId: string;
  userAlias: string;
}

export default function CommunityClient({ categories, userId, userAlias }: CommunityClientProps) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewThread, setShowNewThread] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  async function loadThreads(cat: Category) {
    setActiveCategory(cat);
    setLoading(true);
    setShowNewThread(false);

    const supabase = createClient();
    const { data } = await supabase
      .from("community_threads")
      .select("id, title, content, is_anonymous, is_pinned, is_locked, reply_count, created_at, profiles(alias)")
      .eq("category_id", cat.id)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(30);

    setThreads((data as unknown as Thread[]) ?? []);
    setLoading(false);
  }

  function goBack() {
    setActiveCategory(null);
    setThreads([]);
    setShowNewThread(false);
    setSearchQuery("");
  }

  const filteredThreads = threads.filter((t) => {
    if (!searchQuery.trim()) return true;
    const lower = searchQuery.toLowerCase();
    return t.title.toLowerCase().includes(lower) || t.content.toLowerCase().includes(lower);
  });

  // Category view
  if (!activeCategory) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-header__title">Comunidad 💬</h1>
          <p className="page-header__subtitle">
            Conecta con personas que entienden lo que vives. Elige un tema para participar.
          </p>
        </div>

        <div className="community-categories">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card" onClick={() => loadThreads(cat)}>
              <div className="category-card__icon">{cat.icon}</div>
              <div className="category-card__info">
                <div className="category-card__name">{cat.name}</div>
                <div className="category-card__description">{cat.description}</div>
                {cat.has_trigger_warning && (
                  <div className="trigger-warning">⚠️ Contenido sensible</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  // Thread list view
  return (
    <>
      <div className="page-header">
        <div className="flex items-center gap-md" style={{ marginBottom: "var(--space-sm)" }}>
          <button className="btn btn--ghost btn--sm" onClick={goBack}>← Volver</button>
        </div>
        <h1 className="page-header__title">
          {activeCategory.icon} {activeCategory.name}
        </h1>
        <p className="page-header__subtitle">{activeCategory.description}</p>
        {activeCategory.has_trigger_warning && (
          <div className="trigger-warning" style={{ marginTop: "var(--space-sm)" }}>
            ⚠️ {activeCategory.trigger_warning_text || "Esta categoría contiene temas sensibles"}
          </div>
        )}
        <div className="page-header__actions" style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
          <input 
            type="text" 
            className="input" 
            placeholder="🔍 Buscar en hilos..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "250px" }}
          />
          <button className="btn btn--primary" onClick={() => setShowNewThread(true)}>
            ✍️ Nuevo hilo
          </button>
        </div>
      </div>

      {showNewThread && (
        <NewThreadForm
          categoryId={activeCategory.id}
          userId={userId}
          userAlias={userAlias}
          onCreated={() => loadThreads(activeCategory)}
          onCancel={() => setShowNewThread(false)}
        />
      )}

      {loading ? (
        <div className="card">
          <p className="text-muted text-center p-lg">Cargando hilos...</p>
        </div>
      ) : threads.length === 0 ? (
        <div className="card">
          <div className="lab-empty">
            <div className="lab-empty__icon">💬</div>
            <h3>Sin hilos aún</h3>
            <p className="text-muted" style={{ marginTop: "var(--space-sm)", marginBottom: "var(--space-lg)" }}>
              Sé la primera en iniciar la conversación en esta categoría.
            </p>
            <button className="btn btn--primary" onClick={() => setShowNewThread(true)}>
              ✍️ Crear el primer hilo
            </button>
          </div>
        </div>
      ) : filteredThreads.length === 0 ? (
        <div className="card">
          <p className="text-muted text-center p-lg">No se encontraron hilos que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div className="thread-list">
          {filteredThreads.map((thread) => (
            <ThreadItem key={thread.id} thread={thread} categoryId={activeCategory.id} userId={userId} userAlias={userAlias} />
          ))}
        </div>
      )}
    </>
  );
}

function NewThreadForm({
  categoryId,
  userId,
  userAlias,
  onCreated,
  onCancel,
}: {
  categoryId: string;
  userId: string;
  userAlias: string;
  onCreated: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Título y contenido son requeridos.");
      return;
    }

    setSaving(true);
    setError("");

    const supabase = createClient();
    const threadData: Database["public"]["Tables"]["community_threads"]["Insert"] = {
      category_id: categoryId,
      author_id: userId,
      title: title.trim(),
      content: content.trim(),
      is_anonymous: anonymous,
    };
    const { error: dbError } = await supabase.from("community_threads").insert(threadData as never);

    setSaving(false);

    if (dbError) {
      setError("Error: " + dbError.message);
    } else {
      onCreated();
    }
  }

  return (
    <div className="card" style={{ marginBottom: "var(--space-lg)" }}>
      <form onSubmit={handleSubmit} className="new-thread-form">
        <h3 style={{ fontSize: "var(--text-md)", fontWeight: "var(--weight-semibold)" }}>
          ✍️ Nuevo hilo
        </h3>

        <div className="input-group">
          <label className="input-label">Título</label>
          <input
            type="text"
            className="input"
            placeholder="¿De qué quieres hablar?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={150}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">Contenido</label>
          <textarea
            className="input"
            placeholder="Comparte tu experiencia, pregunta, o reflexión..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
          />
        </div>

        <label className="anonymous-check">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          Publicar de forma anónima
        </label>

        <p className="text-xs text-muted">
          Publicando como: {anonymous ? "🕶️ Anónimo" : `🦋 ${userAlias}`}
        </p>

        {error && <p className="text-error text-sm">⚠️ {error}</p>}

        <div className="flex gap-sm justify-end">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? "Publicando..." : "📤 Publicar"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ThreadItem({
  thread,
  categoryId,
  userId,
  userAlias,
}: {
  thread: Thread;
  categoryId: string;
  userId: string;
  userAlias: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [replies, setReplies] = useState<Array<{
    id: string;
    content: string;
    is_anonymous: boolean;
    created_at: string;
    profiles: { alias: string } | null;
  }>>([]);
  const [replyText, setReplyText] = useState("");
  const [replyAnon, setReplyAnon] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);

  async function toggleExpand() {
    if (expanded) {
      setExpanded(false);
      return;
    }

    setExpanded(true);
    setLoadingReplies(true);

    const supabase = createClient();
    const { data } = await supabase
      .from("community_replies")
      .select("id, content, is_anonymous, created_at, profiles(alias)")
      .eq("thread_id", thread.id)
      .order("created_at", { ascending: true })
      .limit(50);

    setReplies((data as unknown as typeof replies) ?? []);
    setLoadingReplies(false);
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSendingReply(true);

    const supabase = createClient();
    const replyData: Database["public"]["Tables"]["community_replies"]["Insert"] = {
      thread_id: thread.id,
      author_id: userId,
      content: replyText.trim(),
      is_anonymous: replyAnon,
    };
    await supabase.from("community_replies").insert(replyData as never);

    setReplyText("");
    setSendingReply(false);

    // Reload replies
    const { data } = await supabase
      .from("community_replies")
      .select("id, content, is_anonymous, created_at, profiles(alias)")
      .eq("thread_id", thread.id)
      .order("created_at", { ascending: true })
      .limit(50);

    setReplies((data as unknown as typeof replies) ?? []);
  }

  const timeAgo = getTimeAgo(thread.created_at);

  return (
    <div className="thread-item" style={{ flexDirection: "column", cursor: "pointer" }} onClick={toggleExpand}>
      <div className="flex items-center gap-sm" style={{ width: "100%" }}>
        {thread.is_pinned && <span title="Fijado">📌</span>}
        <div className="thread-item__content">
          <div className="thread-item__title">{thread.title}</div>
          <div className="thread-item__meta">
            <span>{thread.is_anonymous ? "🕶️ Anónimo" : `🦋 ${thread.profiles?.alias ?? "Usuario"}`}</span>
            <span>🕐 {timeAgo}</span>
            <span>💬 {thread.reply_count} respuestas</span>
            {thread.is_locked && <span>🔒 Cerrado</span>}
          </div>
        </div>
      </div>

      {expanded && (
        <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", marginTop: "var(--space-md)" }}>
          <p style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-md)", whiteSpace: "pre-wrap" }}>
            {thread.content}
          </p>

          <div style={{ borderTop: "1px solid var(--color-outline-variant)", paddingTop: "var(--space-md)" }}>
            <h4 style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-sm)" }}>
              💬 Respuestas ({replies.length})
            </h4>

            {loadingReplies ? (
              <p className="text-muted text-sm">Cargando...</p>
            ) : (
              <div className="flex flex-col gap-sm">
                {replies.map((r) => (
                  <div key={r.id} style={{ padding: "var(--space-sm)", background: "var(--color-surface-container)", borderRadius: "var(--radius-md)" }}>
                    <div className="flex items-center gap-sm" style={{ marginBottom: "4px" }}>
                      <span className="text-xs font-semibold">
                        {r.is_anonymous ? "🕶️ Anónimo" : `🦋 ${r.profiles?.alias ?? "Usuario"}`}
                      </span>
                      <span className="text-xs text-muted">{getTimeAgo(r.created_at)}</span>
                    </div>
                    <p className="text-sm" style={{ whiteSpace: "pre-wrap" }}>{r.content}</p>
                  </div>
                ))}

                {!thread.is_locked && (
                  <form onSubmit={handleReply} className="flex flex-col gap-sm" style={{ marginTop: "var(--space-sm)" }}>
                    <textarea
                      className="input"
                      placeholder="Escribe tu respuesta..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={2}
                      style={{ minHeight: "60px" }}
                    />
                    <div className="flex items-center justify-between">
                      <label className="anonymous-check">
                        <input
                          type="checkbox"
                          checked={replyAnon}
                          onChange={(e) => setReplyAnon(e.target.checked)}
                        />
                        Anónimo
                      </label>
                      <button type="submit" className="btn btn--primary btn--sm" disabled={sendingReply || !replyText.trim()}>
                        {sendingReply ? "..." : "Responder"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `hace ${days}d`;
  return d.toLocaleDateString("es-MX", { month: "short", day: "numeric" });
}
