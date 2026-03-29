import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          🦋 {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/backend/intro">
            ⚙️ Backend
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/frontend/intro">
            🎨 Frontend
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/user-guide/intro">
            📖 Guía de Usuario
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/admin/intro">
            🔒 Administración
          </Link>
        </div>
      </div>
    </header>
  );
}

function HomepageFeatures() {
  const features = [
    {
      title: 'Registro Diario',
      emoji: '📝',
      description: 'Documenta cómo registrar energía, niebla mental, ánimo y dolor articular con escala Likert 1-5.',
    },
    {
      title: 'Laboratorios',
      emoji: '🔬',
      description: 'Guía para almacenar TSH, T3, T4 y anticuerpos con interpretación automática de rangos.',
    },
    {
      title: 'Seguridad',
      emoji: '🔒',
      description: 'Arquitectura RLS completa. Datos de salud 100% privados con Row-Level Security.',
    },
    {
      title: 'Comunidad',
      emoji: '💬',
      description: '12 categorías, posts anónimos, trigger warnings y moderación de contenido.',
    },
    {
      title: 'Design System',
      emoji: '🎨',
      description: 'Ethereal Sanctuary: glassmorphism, paleta lavanda-mint, tokens CSS documentados.',
    },
    {
      title: 'TypeScript',
      emoji: '💎',
      description: 'Types end-to-end. Base de datos, API y UI totalmente tipados.',
    },
  ];

  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {features.map((feature, idx) => (
            <div key={idx} className={clsx('col col--4')} style={{marginBottom: '2rem'}}>
              <div className="text--center" style={{fontSize: '3rem'}}>
                {feature.emoji}
              </div>
              <div className="text--center padding-horiz--md">
                <Heading as="h3">{feature.title}</Heading>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Inicio"
      description="Documentación completa de TiroVida - Plataforma comunitaria de hipotiroidismo">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
