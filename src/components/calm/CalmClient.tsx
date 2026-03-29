"use client";

import { useState, useEffect } from "react";

const EXERCISES = [
  {
    id: "box",
    title: "Respiración Cuadrada (4-4-4-4)",
    desc: "Reduce la ansiedad y el estrés rápidamente.",
    duration: "2-5 min",
    icon: "🔲"
  },
  {
    id: "relax",
    title: "Relajación 4-7-8",
    desc: "Ideal para conciliar el sueño ante el insomnio.",
    duration: "5 min",
    icon: "🌙"
  },
  {
    id: "body",
    title: "Escaneo Corporal",
    desc: "Conecta con tu cuerpo y libera tensiones.",
    duration: "10 min",
    icon: "🧘"
  },
  {
    id: "energy",
    title: "Respiración Energizante",
    desc: "Combate la fatiga o la niebla mental del medio día.",
    duration: "3 min",
    icon: "⚡"
  }
];

export default function CalmClient() {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [breatheState, setBreatheState] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale");
  const [timeLeft, setTimeLeft] = useState(60); // 1 minuto de demo

  // Lógica simple para la respiración cuadrada (4s cada fase)
  useEffect(() => {
    if (activeExercise !== "box") return;

    const sequence = ["inhale", "hold1", "exhale", "hold2"] as const;
    let step = 0;

    const interval = setInterval(() => {
      step = (step + 1) % 4;
      setBreatheState(sequence[step]);
    }, 4000);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setActiveExercise(null);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [activeExercise]);

  if (activeExercise === "box") {
    return (
      <div className="module-page" style={{ alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
        <button className="btn btn--ghost" onClick={() => setActiveExercise(null)} style={{ alignSelf: "flex-start" }}>
          ← Detener
        </button>
        
        <h2 className="module-title" style={{ marginTop: "var(--space-2xl)", textAlign: "center" }}>
          Respiración Cuadrada
        </h2>
        
        <div className={`breathing-circle ${breatheState === "inhale" || breatheState === "hold1" ? "breathing-circle--inhale" : "breathing-circle--exhale"}`}>
          {breatheState === "inhale" && "Inhala"}
          {breatheState === "hold1" && "Sostén"}
          {breatheState === "exhale" && "Exhala"}
          {breatheState === "hold2" && "Sostén"}
        </div>
        
        <p style={{ color: "var(--color-on-surface-variant)", marginTop: "var(--space-xl)", fontSize: "var(--text-lg)" }}>
          00:{timeLeft.toString().padStart(2, "0")}
        </p>
      </div>
    );
  }

  return (
    <div className="module-page">
      <div className="calm-hero">
        <div className="calm-hero__icon">🧘‍♀️</div>
        <h1 className="module-title">Centro de Calma</h1>
        <p style={{ color: "var(--color-on-surface-variant)", fontSize: "var(--text-base)", maxWidth: 600, margin: "0 auto" }}>
          Un espacio diseñado para ayudarte a reconectar. Encuentra equilibrio 
          cuando sientas ansiedad, fatiga o necesites mejorar tu sueño.
        </p>
      </div>

      <div className="calm-exercises">
        {EXERCISES.map((ex) => (
          <div 
            key={ex.id} 
            className="calm-card"
            onClick={() => {
              if (ex.id === "box") {
                setActiveExercise("box");
                setBreatheState("inhale");
                setTimeLeft(60);
              }
            }}
          >
            <div className="calm-card__icon">{ex.icon}</div>
            <h3 className="calm-card__title">{ex.title}</h3>
            <p className="calm-card__desc">{ex.desc}</p>
            <div className="calm-card__duration">⏱️ {ex.duration}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
