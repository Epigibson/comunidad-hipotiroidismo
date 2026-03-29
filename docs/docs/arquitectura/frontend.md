---
id: frontend
title: "Estética y Sistema Visual"
sidebar_position: 3
---

# ✨ El Santuario Etéreo (Ethereal Sanctuary CSS)

La plataforma "TiroVida" está profundamente diseñada con un lenguaje visual pacífico, enfocado en personas sobrepasadas por sintomatología crónica cerebral (Brain Fog, Ansiedad, Dolores, Agotamiento). El sistema, que se opone rotundamente a los portales médicos bruscos y cuadrados, busca entregar al usuario la máxima serenidad posible al abrirse ante nosotros.

### Adiós a la Frialdad Hospitalaria
TiroVida descarta `TailwindCSS` en favor de un diseño estructural y jerárquico personalizado al 100% de la mano de **variables CSS vainilla** en `globals.css` (tokens).
Toda su identidad cromática recae sobre una variable abstracta muy especial ("Cristalomorfismo"):
*   Fondo Oscuro Sólido (#0d0f12), creando la ilusión de un cielo místico, acompañado de púrpuras tenues que connotan el listón universal de Tiroides (`--color-primary`, `--color-surface-container`).
*   Los contenedores de métricas utilizan transparencias al `20%-50%` y filtros de desenfoque (`backdrop-filter: blur(16px)`), dando efecto de "Cristal Embebido", para suavizar la fatiga visual.

### Componentes Animados Fluidos
1.  **Tableros (StatCards)**: Sin bordes rígidos (Regla 'No-Line'), sombreados cálidos mediante `--shadow-glow` para dar impresión de luz intrínseca.
2.  **Módulos Gráficos**: Extracciones estadísticas de `recharts` que muestran los picos del registro, envueltos con animaciones *mount-transition* para evitar tirones.
3.  **Wizard (Onboarding Cíclico)**: Creado con un slider dinámico controlado por pasos de `React-State` (`1 al 4`), dando visibilidad inmediata de las métricas vitales, con botones "pulsantes" sobre hover para un instinto orgánico al interactuar.

> "A nuestros pacientes les duele la niebla mental tanto como el peso... No les hagamos una interfaz ruidosa." -- **The Ethereal Commandment.**
