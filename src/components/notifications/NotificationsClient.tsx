"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/types/database";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export default function NotificationsClient() {
  const [tab, setTab] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel>;

    async function loadAlerts() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      
      if (data) setNotifications(data);
      setLoading(false);

      // Suscripción Realtime (WebSockets)
      channel = supabase
        .channel('realtime-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${session.user.id}`
          },
          (payload: any) => {
            const newNotification = payload.new as Notification;
            setNotifications((prev) => [newNotification, ...prev]);
          }
        )
        .subscribe();
    }

    loadAlerts();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const filtered = tab === "all" 
    ? notifications 
    : tab === "unread" 
      ? notifications.filter(n => !n.is_read)
      : notifications.filter(n => n.type === tab);

  const markAllRead = async () => {
    if (notifications.every(n => n.is_read)) return;
    
    // UI Optimista
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    
    // DB
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", session.user.id)
        .eq("is_read", false);
    }
  };

  const markRead = async (id: string, currentRead: boolean | null, link: string | null) => {
    if (!currentRead) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    }
    
    // Si tiene un enlace (ej: ir al foro), redirigimos (Opcional, manejado aquí si se requiere router)
    if (link) {
      window.location.href = link;
    }
  };

  const getTimeString = (dateStr: string) => {
    const dates = new Date(dateStr);
    return dates.toLocaleDateString() + ' ' + dates.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className="module-page">
      <div className="module-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="module-title">Centro de Notificaciones</h1>
          <p style={{ color: "var(--color-on-surface-variant)", fontSize: "var(--text-sm)" }}>
            Mantente al día con tu comunidad y alertas vivas.
          </p>
        </div>
        <button className="btn btn--ghost" onClick={markAllRead}>
          ✓ Marcar todo como leído
        </button>
      </div>

      <div className="notification-tabs">
        <button 
          className={`notification-tab ${tab === "all" ? "notification-tab--active" : ""}`}
          onClick={() => setTab("all")}
        >
          Todas
        </button>
        <button 
          className={`notification-tab ${tab === "unread" ? "notification-tab--active" : ""}`}
          onClick={() => setTab("unread")}
        >
          No leídas
        </button>
        <button 
          className={`notification-tab ${tab === "community" ? "notification-tab--active" : ""}`}
          onClick={() => setTab("community")}
        >
          Comunidad
        </button>
        <button 
          className={`notification-tab ${tab === "reminder" ? "notification-tab--active" : ""}`}
          onClick={() => setTab("reminder")}
        >
          Recordatorios
        </button>
      </div>

      <div className="notification-list">
        {loading ? (
          <div className="empty-state">
            <h3 className="empty-state__title">Sincronizando...</h3>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🔕</div>
            <h3 className="empty-state__title">Todo al día</h3>
            <p className="empty-state__subtitle">No tienes notificaciones en esta sección.</p>
          </div>
        ) : (
          filtered.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.is_read ? "notification-item--unread" : ""}`}
              onClick={() => markRead(notification.id, notification.is_read, notification.link)}
            >
              <div className="notification-item__icon">{notification.icon || "🔔"}</div>
              <div className="notification-item__content">
                <h4 className="notification-item__title">{notification.title}</h4>
                <p className="notification-item__body">{notification.body}</p>
                <div className="notification-item__time">{getTimeString(notification.created_at)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
