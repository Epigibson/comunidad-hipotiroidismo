import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  backendSidebar: [
    'backend/intro',
    {
      type: 'category',
      label: '🗄️ Base de Datos',
      items: [
        'backend/database/schema',
        'backend/database/rls-policies',
        'backend/database/triggers',
        'backend/database/migrations',
      ],
    },
    {
      type: 'category',
      label: '🔐 Autenticación',
      items: [
        'backend/auth/overview',
        'backend/auth/oauth',
        'backend/auth/session-management',
      ],
    },
    {
      type: 'category',
      label: '🌐 API',
      items: [
        'backend/api/supabase-client',
        'backend/api/endpoints',
      ],
    },
    'backend/environment',
  ],

  frontendSidebar: [
    'frontend/intro',
    {
      type: 'category',
      label: '🎨 Design System',
      items: [
        'frontend/design-system/tokens',
        'frontend/design-system/components',
        'frontend/design-system/glassmorphism',
      ],
    },
    {
      type: 'category',
      label: '📐 Arquitectura',
      items: [
        'frontend/architecture/project-structure',
        'frontend/architecture/routing',
        'frontend/architecture/data-fetching',
      ],
    },
    {
      type: 'category',
      label: '🧩 Componentes',
      items: [
        'frontend/components/layout',
        'frontend/components/auth',
        'frontend/components/dashboard',
      ],
    },
    'frontend/deployment',
  ],

  userGuideSidebar: [
    'user-guide/intro',
    'user-guide/getting-started',
    'user-guide/daily-tracking',
    'user-guide/lab-results',
    'user-guide/reports',
    'user-guide/community',
    'user-guide/buddy-system',
    'user-guide/privacy',
    'user-guide/faq',
  ],

  adminSidebar: [
    'admin/intro',
    'admin/user-management',
    'admin/content-moderation',
    'admin/community-categories',
    'admin/analytics',
    'admin/config-email',
    'admin/deployment',
  ],

  // --- NUEVAS GUÍAS MAESTRAS (SPRINT FINAL) ---
  sprintFinalSidebar: [
    {
      type: 'category',
      label: '🏗️ Arquitectura Técnica',
      collapsed: false,
      items: [
        'arquitectura/stack',
        'arquitectura/backend',
        'arquitectura/frontend',
      ],
    },
    {
      type: 'category',
      label: '📚 Manual de Operación',
      collapsed: false,
      items: [
        'uso/pacientes',
        'uso/administradores',
      ],
    },
  ],
};

export default sidebars;
