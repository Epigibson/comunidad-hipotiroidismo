import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'TiroVida Docs',
  tagline: 'Documentación completa de la plataforma TiroVida 🦋',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://tirovida-docs.vercel.app',
  baseUrl: '/',

  organizationName: 'epigibson',
  projectName: 'comunidad-hipotiroidismo',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/epigibson/comunidad-hipotiroidismo/tree/main/docs/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/epigibson/comunidad-hipotiroidismo/tree/main/docs/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/tirovida-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'TiroVida Docs',
      logo: {
        alt: 'TiroVida Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'backendSidebar',
          position: 'left',
          label: '⚙️ Backend',
        },
        {
          type: 'docSidebar',
          sidebarId: 'frontendSidebar',
          position: 'left',
          label: '🎨 Frontend',
        },
        {
          type: 'docSidebar',
          sidebarId: 'userGuideSidebar',
          position: 'left',
          label: '📖 Guía de Usuario',
        },
        {
          type: 'docSidebar',
          sidebarId: 'adminSidebar',
          position: 'left',
          label: '🔒 Administración',
        },
        {to: '/blog', label: '📝 Changelog', position: 'left'},
        {
          href: 'https://github.com/epigibson/comunidad-hipotiroidismo',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentación',
          items: [
            { label: 'Backend', to: '/docs/backend/intro' },
            { label: 'Frontend', to: '/docs/frontend/intro' },
            { label: 'Guía de Usuario', to: '/docs/user-guide/intro' },
            { label: 'Administración', to: '/docs/admin/intro' },
          ],
        },
        {
          title: 'Recursos',
          items: [
            { label: 'App TiroVida', href: 'https://tirovida.vercel.app' },
            { label: 'Supabase Dashboard', href: 'https://supabase.com/dashboard/project/jdndcaokvcggxxxgtmei' },
          ],
        },
        {
          title: 'Más',
          items: [
            { label: 'Changelog', to: '/blog' },
            { label: 'GitHub', href: 'https://github.com/epigibson/comunidad-hipotiroidismo' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} TiroVida 🦋 — Hecho con 💜 para la comunidad tiroidea. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'sql', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
