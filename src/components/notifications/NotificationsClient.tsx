"use client";

import { useState } from "react";

const DEMO_NOTIFICATIONS = [
  {
    id: "1",
    type: "community",
    title: "Nueva respuesta en tu hilo",
    body: "Alguien respondió a tu pregunta sobre Levotiroxina en ayunas.",
    time: "Hace 10 minutos",
    icon: "💬",
    unread: true,
  },
  {
    id: "2",
    type: "reminder",
    title: "¡Es hora de tu medicación!",
    body: "No olvides tomar tu dosis de 75mcg.",
    time: "Hace 2 horas",
    icon: "💊",
    unread: true,
  },
  {
    id: "3",
    type: "lab",
    title: "Recordatorio de Laboratorios",
    body: "Han pasado 6 meses desde tus últimos análisis. Considera programar un perfil tiroideo.",
    time: "Hace 2 días",
    icon: "🔬",
    unread: false,
  },
  {
    id: "4",
    type: "system",
    title: "Nuevo artículo disponible",
    body: "📚 Hemos publicado una nueva Guía de Nutrición. ¡Échale un vistazo!",
    time: "Hace 5 días",
    icon: "🔔",
    unread: false,
  },
  {
    id: "5",
    type: "community",
    title: "Tu post ha sido fijado",
    body: "Un moderador fijó tu post en la categoría de Recetas.",
    time: "Hace 1 semana",
    icon: "📌",
    unread: false,
  },
];

export default function NotificationsClient() {
  const [tab, setTab] = useState("all");
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);

  const filtered = tab === "all" 
    ? notifications 
    : tab === "unread" 
      ? notifications.filter(n => n.unread)
      : notifications.filter(n => n.type === tab);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  return (
    <div className="module-page">
      <div className="module-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="module-title">Centro de Notificaciones</h1>
          <p style={{ color: "var(--color-on-surface-variant)", fontSize: "var(--text-sm)" }}>
            Mantente al día con tu comunidad y recordatorios.
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
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🔕</div>
            <h3 className="empty-state__title">Todo al día</h3>
            <p className="empty-state__subtitle">No tienes notificaciones en esta sección.</p>
          </div>
        ) : (
          filtered.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.unread ? "notification-item--unread" : ""}`}
              onClick={() => markRead(notification.id)}
            >
              <div className="notification-item__icon">{notification.icon}</div>
              <div className="notification-item__content">
                <h4 className="notification-item__title">{notification.title}</h4>
                <p className="notification-item__body">{notification.body}</p>
                <div className="notification-item__time">{notification.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
