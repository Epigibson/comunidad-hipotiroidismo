---
sidebar_position: 1
---

# 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── (auth)/                    # Route group: Auth pages
│   │   ├── layout.tsx             # Auth layout (centered, glassmorphism)
│   │   ├── auth.css               # Auth styles
│   │   ├── login/page.tsx         # Login page
│   │   └── register/page.tsx      # Register page
│   │
│   ├── (dashboard)/               # Route group: App pages
│   │   ├── layout.tsx             # Dashboard layout (nav + bottom nav)
│   │   ├── dashboard.css          # Dashboard styles
│   │   ├── dashboard/page.tsx     # Home dashboard
│   │   ├── tracker/page.tsx       # Daily symptom tracker
│   │   ├── labs/page.tsx          # Lab results
│   │   ├── reports/page.tsx       # Clinical reports
│   │   ├── community/page.tsx     # Community forums
│   │   └── profile/page.tsx       # User profile
│   │
│   ├── auth/
│   │   └── callback/route.ts      # OAuth/email callback handler
│   │
│   ├── globals.css                # Design System tokens + components
│   ├── landing.css                # Landing page styles
│   ├── layout.tsx                 # Root layout (fonts, meta)
│   └── page.tsx                   # Landing page
│
├── components/
│   └── layout/
│       ├── DashboardNav.tsx       # Top navigation
│       └── BottomNav.tsx          # Mobile bottom navigation
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser Supabase client
│   │   ├── server.ts              # Server Supabase client
│   │   └── middleware.ts          # Session refresh logic
│   ├── types/
│   │   └── database.ts            # TypeScript types for DB
│   └── utils.ts                   # Utility functions
│
└── proxy.ts                       # Next.js 16 proxy (ex-middleware)
```

## Route Groups

Next.js usa paréntesis `()` para definir **route groups** que comparten un layout sin afectar la URL:

- `(auth)` → Layout centrado, sin nav. URLs: `/login`, `/register`
- `(dashboard)` → Layout con nav top + bottom. URLs: `/dashboard`, `/tracker`, etc.
