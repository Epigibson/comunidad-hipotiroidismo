"use client";

import { useState } from "react";

const CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "thyroid", label: "🦋 Tiroides" },
  { id: "nutrition", label: "🥗 Nutrición" },
  { id: "exercise", label: "🏃‍♀️ Ejercicio" },
  { id: "mental", label: "🧠 Salud Mental" },
  { id: "medication", label: "💊 Medicación" },
  { id: "labs", label: "🔬 Laboratorios" },
];

const ARTICLES = [
  {
    id: "thyroid-101",
    category: "thyroid",
    title: "Hipotiroidismo 101: Todo lo que necesitas saber",
    excerpt: "Guía completa sobre el hipotiroidismo: causas, síntomas, diagnóstico y tratamiento. Información avalada por endocrinólogos.",
    icon: "🦋",
    readTime: "8 min",
    date: "2024-12-01",
  },
  {
    id: "hashimoto",
    category: "thyroid",
    title: "Tiroiditis de Hashimoto: La enfermedad autoinmune",
    excerpt: "Entiende la relación entre tu sistema inmune y la tiroides. ¿Qué son los anticuerpos Anti-TPO y Anti-Tg?",
    icon: "🔬",
    readTime: "10 min",
    date: "2024-11-28",
  },
  {
    id: "nutrition-guide",
    category: "nutrition",
    title: "Guía de Nutrición para Hipotiroidismo",
    excerpt: "Descubre los alimentos que ayudan o perjudican tu función tiroidea. Incluye plan de alimentación semanal.",
    icon: "🥗",
    readTime: "12 min",
    date: "2024-11-25",
    featured: true,
  },
  {
    id: "selenium",
    category: "nutrition",
    title: "Selenio y Tiroides: El mineral clave",
    excerpt: "El selenio es esencial para la conversión de T4 a T3. Conoce las mejores fuentes alimentarias y la dosis recomendada.",
    icon: "🥜",
    readTime: "6 min",
    date: "2024-11-20",
  },
  {
    id: "exercise-guide",
    category: "exercise",
    title: "Ejercicio con Hipotiroidismo: Guía práctica",
    excerpt: "Rutinas adaptadas a tu nivel de energía. Ejercicios de bajo impacto que ayudan a mejorar tu metabolismo.",
    icon: "🧘",
    readTime: "7 min",
    date: "2024-11-15",
  },
  {
    id: "anxiety-thyroid",
    category: "mental",
    title: "Ansiedad y Tiroides: La conexión oculta",
    excerpt: "Los desequilibrios tiroideos afectan directamente tu salud mental. Aprende a diferenciar síntomas y encontrar ayuda.",
    icon: "🧠",
    readTime: "9 min",
    date: "2024-11-10",
  },
  {
    id: "levothyroxine",
    category: "medication",
    title: "Levotiroxina: Todo sobre tu medicamento",
    excerpt: "Guía completa sobre la levotiroxina: cuándo tomarla, interacciones, efectos secundarios y errores comunes al tomarla.",
    icon: "💊",
    readTime: "8 min",
    date: "2024-11-05",
  },
  {
    id: "understanding-labs",
    category: "labs",
    title: "Cómo leer tus resultados de laboratorio",
    excerpt: "Interpreta tus valores de TSH, T4L, T3L y anticuerpos. ¿Qué significan los rangos y cuándo preocuparse?",
    icon: "📊",
    readTime: "11 min",
    date: "2024-10-30",
  },
  {
    id: "gluten-thyroid",
    category: "nutrition",
    title: "Gluten y Hashimoto: ¿Debes eliminarlo?",
    excerpt: "La relación entre el gluten, la permeabilidad intestinal y la autoinmunidad tiroidea. Evidencia científica y recomendaciones.",
    icon: "🌾",
    readTime: "7 min",
    date: "2024-10-25",
  },
  {
    id: "brain-fog",
    category: "mental",
    title: "Niebla Mental: Cómo combatirla",
    excerpt: "Estrategias prácticas para manejar la niebla mental causada por hipotiroidismo: alimentación, sueño y suplementación.",
    icon: "🌫️",
    readTime: "6 min",
    date: "2024-10-20",
  },
  {
    id: "pregnancy-thyroid",
    category: "thyroid",
    title: "Embarazo e Hipotiroidismo",
    excerpt: "Todo lo que debes saber sobre el manejo tiroideo antes, durante y después del embarazo. Ajustes de medicación y controles.",
    icon: "🤰",
    readTime: "10 min",
    date: "2024-10-15",
  },
  {
    id: "vitamin-d",
    category: "nutrition",
    title: "Vitamina D y función tiroidea",
    excerpt: "La deficiencia de Vitamina D es común en hipotiroidismo. Conoce los valores óptimos y cómo suplementarte correctamente.",
    icon: "☀️",
    readTime: "5 min",
    date: "2024-10-10",
  },
];

interface Props {
  selectedArticle?: string;
}

export default function KnowledgeClient({ selectedArticle }: Props) {
  const [category, setCategory] = useState("all");
  const [viewingId, setViewingId] = useState<string | null>(selectedArticle || null);

  const filtered = category === "all" ? ARTICLES : ARTICLES.filter((a) => a.category === category);
  const currentArticle = ARTICLES.find((a) => a.id === viewingId);

  if (currentArticle) {
    return (
      <div className="module-page">
        <div className="module-header">
          <button className="btn btn--ghost" onClick={() => setViewingId(null)}>← Volver a la Biblioteca</button>
        </div>
        <ArticleDetail article={currentArticle} />
      </div>
    );
  }

  return (
    <div className="module-page">
      {/* Hero */}
      <div className="knowledge-hero">
        <div className="knowledge-hero__icon">📚</div>
        <h1 className="module-title" style={{ marginBottom: "var(--space-xs)" }}>Biblioteca de Conocimiento</h1>
        <p style={{ color: "var(--color-on-surface-variant)", fontSize: "var(--text-sm)", maxWidth: 500, margin: "0 auto" }}>
          Artículos educativos avalados por profesionales de la salud para entender y manejar tu condición tiroidea.
        </p>
      </div>

      {/* Categories */}
      <div className="knowledge-categories">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`knowledge-cat-btn ${category === c.id ? "knowledge-cat-btn--active" : ""}`}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="article-grid">
        {filtered.map((article) => (
          <div key={article.id} className="article-card" onClick={() => setViewingId(article.id)}>
            <div className="article-card__image">{article.icon}</div>
            <div className="article-card__body">
              <div className="article-card__category">
                {CATEGORIES.find((c) => c.id === article.category)?.label}
              </div>
              <h3 className="article-card__title">{article.title}</h3>
              <p className="article-card__excerpt">{article.excerpt}</p>
              <div className="article-card__meta">
                <span>⏱️ {article.readTime}</span>
                <span>📅 {article.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArticleDetail({ article }: { article: (typeof ARTICLES)[number] }) {
  const contents: Record<string, React.ReactNode> = {
    "nutrition-guide": (
      <div className="article-detail__content">
        <h2>🥗 Alimentación y Tiroides</h2>
        <p>
          La nutrición juega un papel fundamental en el manejo del hipotiroidismo.
          Una alimentación equilibrada puede ayudar a optimizar tu función tiroidea
          y mejorar tu calidad de vida.
        </p>

        <h3>Alimentos recomendados</h3>
        <ul>
          <li><strong>Mariscos y pescados:</strong> Ricos en yodo y selenio (salmón, atún, camarones)</li>
          <li><strong>Nueces de Brasil:</strong> La fuente más rica en selenio (2-3 al día es suficiente)</li>
          <li><strong>Huevos:</strong> Contienen yodo y selenio, especialmente la yema</li>
          <li><strong>Legumbres:</strong> Frijoles, lentejas y garbanzos aportan zinc y hierro</li>
          <li><strong>Frutas y verduras:</strong> Berries, camote, espinaca (cocida), brócoli (cocido)</li>
          <li><strong>Probióticos:</strong> Yogurt, kéfir, kombucha para salud intestinal</li>
        </ul>

        <div className="info-box info-box--tip">
          <strong>💡 Tip importante:</strong> El brócoli, coliflor y col son saludables para personas con hipotiroidismo
          siempre y cuando se consuman <em>cocidos</em> y en cantidades moderadas. Cocerlos desactiva los goitrógenos.
        </div>

        <h3>Alimentos a moderar</h3>
        <ul>
          <li><strong>Soya y derivados:</strong> Pueden interferir con la absorción de levotiroxina</li>
          <li><strong>Gluten:</strong> Especialmente si tienes Hashimoto (consulta con tu médico)</li>
          <li><strong>Azúcar refinada:</strong> Puede empeorar la inflamación</li>
          <li><strong>Cafeína en exceso:</strong> Puede interferir con la absorción del medicamento</li>
          <li><strong>Alimentos ultraprocesados:</strong> Altos en sodio y aditivos inflamatorios</li>
        </ul>

        <h2>📋 Plan de alimentación sugerido</h2>
        <h3>Desayuno (esperar 30-60 min después del medicamento)</h3>
        <ul>
          <li>2 huevos revueltos con espinaca</li>
          <li>1 rebanada de pan integral (sin gluten si es necesario)</li>
          <li>1 taza de frutas de temporada</li>
          <li>Té verde o infusión (sin cafeína si es posible)</li>
        </ul>

        <h3>Comida</h3>
        <ul>
          <li>Salmón al horno con limón</li>
          <li>Ensalada de quinoa con verduras asadas</li>
          <li>Brócoli al vapor con aceite de oliva</li>
          <li>1 taza de arroz integral</li>
        </ul>

        <h3>Cena</h3>
        <ul>
          <li>Sopa de lentejas con verduras</li>
          <li>2-3 nueces de Brasil</li>
          <li>Ensalada verde con aguacate</li>
        </ul>

        <div className="info-box info-box--warning">
          <strong>⚠️ Recuerda:</strong> Esta guía es informativa. Siempre consulta con tu
          endocrinólogo y nutriólogo antes de hacer cambios significativos en tu alimentación.
        </div>

        <h2>💊 Suplementos clave</h2>
        <ul>
          <li><strong>Selenio:</strong> 55-200 mcg/día (mejor de fuentes naturales)</li>
          <li><strong>Vitamina D:</strong> Según tus niveles en sangre (meta: 40-60 ng/mL)</li>
          <li><strong>Zinc:</strong> 15-30 mg/día</li>
          <li><strong>Magnesio:</strong> 200-400 mg/día (preferir glicinato)</li>
          <li><strong>Vitamina B12:</strong> Especialmente si es deficiente</li>
        </ul>
      </div>
    ),
  };

  const defaultContent = (
    <div className="article-detail__content">
      <p>{article.excerpt}</p>
      <div className="info-box info-box--info">
        <strong>📝 Nota:</strong> Este artículo está siendo redactado por nuestro equipo editorial
        en colaboración con profesionales de la salud. Estará disponible pronto con contenido completo.
      </div>
      <h2>¿Por qué es importante?</h2>
      <p>
        Entender tu condición es el primer paso para manejarla correctamente.
        En TiroVida nos esforzamos por ofrecerte información confiable y actualizada,
        revisada por endocrinólogos y especialistas en tiroides.
      </p>
      <h2>Próximamente</h2>
      <ul>
        <li>Contenido completo redactado por especialistas</li>
        <li>Infografías descargables</li>
        <li>Videos explicativos</li>
        <li>Preguntas frecuentes interactivas</li>
      </ul>
    </div>
  );

  return (
    <div className="article-detail">
      <div className="article-detail__header">
        <div style={{ fontSize: "3rem", marginBottom: "var(--space-md)" }}>{article.icon}</div>
        <div className="article-card__category">{article.category.toUpperCase()}</div>
        <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-extrabold)", marginBottom: "var(--space-sm)" }}>
          {article.title}
        </h1>
        <div className="article-card__meta">
          <span>⏱️ {article.readTime} de lectura</span>
          <span>📅 {article.date}</span>
        </div>
      </div>
      {contents[article.id] || defaultContent}
    </div>
  );
}
