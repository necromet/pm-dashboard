# PM Dashboard - Codebase Structure

## Overview

A **Project Management Dashboard** built with React 19, Vite, and Tailwind CSS v4. It provides views for managing projects, clients, content briefs, and pipelines with drag-and-drop kanban functionality.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.2.4 |
| Build Tool | Vite | 8.0.1 |
| Styling | Tailwind CSS | 4.2.2 |
| Routing | React Router DOM | 7.13.2 |
| DnD | @hello-pangea/dnd | 18.0.1 |
| Icons | Lucide React | 1.7.0 |
| Dates | date-fns | 4.1.0 |
| Linting | ESLint | 9.39.4 |

## Directory Tree

```
pm-dashboard/
├── .kilo/                          # Kilo agent configuration
├── dist/                           # Production build output
├── public/                         # Static assets (favicon, icons)
├── src/
│   ├── assets/                     # Images (hero.png, logos)
│   ├── components/                 # Reusable UI components
│   │   ├── activity/               # Activity feed & notifications
│   │   │   ├── ActivityFeed.jsx
│   │   │   └── NotificationCenter.jsx
│   │   ├── briefs/                 # Content brief management
│   │   │   ├── BriefForm.jsx
│   │   │   ├── BriefList.jsx
│   │   │   └── ContentCalendar.jsx
│   │   ├── client/                 # Client-related components
│   │   │   ├── ClientOverview.jsx
│   │   │   ├── QuotaTracker.jsx
│   │   │   └── TeamList.jsx
│   │   ├── dashboard/              # Dashboard widgets
│   │   │   ├── BottleneckAlert.jsx
│   │   │   ├── ClientCard.jsx
│   │   │   └── StatsGrid.jsx
│   │   ├── kanban/                 # Drag-and-drop board
│   │   │   ├── KanbanBoard.jsx
│   │   │   ├── KanbanColumn.jsx
│   │   │   └── TaskCard.jsx
│   │   ├── layout/                 # App shell components
│   │   │   ├── Header.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── Sidebar.jsx
│   │   └── ui/                     # Generic UI primitives
│   │       ├── Avatar.jsx
│   │       ├── Badge.jsx
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Modal.jsx
│   │       ├── ProgressBar.jsx
│   │       └── Tooltip.jsx
│   ├── data/                       # Mock/static data
│   │   └── mockData.js
│   ├── hooks/                      # Custom React hooks
│   │   ├── useLocalStorage.js
│   │   └── useNotifications.js
│   ├── pages/                      # Route-level page components
│   │   ├── BriefsPage.jsx
│   │   ├── ClientDashboard.jsx
│   │   ├── GlobalDashboard.jsx
│   │   ├── PipelineView.jsx
│   │   ├── ReportsPage.jsx
│   │   └── SettingsPage.jsx
│   ├── utils/                      # Helper functions
│   │   └── helpers.js
│   ├── App.jsx                     # Root component & router
│   ├── App.css                     # App-level styles
│   ├── index.css                   # Global styles (Tailwind + CSS vars)
│   └── main.jsx                    # Entry point
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
├── eslint.config.js                # ESLint flat config
└── package.json                    # Dependencies & scripts
```

## Architecture

### Entry Point
`src/main.jsx` bootstraps the React app via `createRoot`, rendering `<App />` in strict mode.

### Routing (`src/App.jsx`)
React Router v7 with `BrowserRouter`. Routes:

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `GlobalDashboard` | Main dashboard overview |
| `/pipeline` | `PipelineView` | Kanban board for tasks |
| `/clients` | `ClientDashboard` | Client list/overview |
| `/clients/:clientId` | `ClientDashboard` | Individual client detail |
| `/briefs` | `BriefsPage` | Content brief management |
| `/reports` | `ReportsPage` | Reporting interface |
| `/settings` | `SettingsPage` | App settings |

### Component Organization

- **`components/ui/`** - Atomic, reusable primitives (Button, Card, Badge, Modal, etc.)
- **`components/layout/`** - App shell (Sidebar, Header, Layout wrapper)
- **`components/kanban/`** - Drag-and-drop kanban board using `@hello-pangea/dnd`
- **`components/dashboard/`** - Dashboard-specific widgets (stats, alerts, client cards)
- **`components/activity/`** - Activity feed and notification center
- **`components/briefs/`** - Content brief forms, lists, and calendar views
- **`components/client/`** - Client overview, team list, and quota tracking

### Styling
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- CSS custom properties in `src/index.css` define design tokens (`--primary`, `--success`, `--warning`, `--danger`)
- Dark mode support via `.dark` class with alternate variable values
- Layout constants: sidebar width `260px`, header height `64px`

### State & Data
- `src/data/mockData.js` - Static mock data for development
- `src/hooks/useLocalStorage.js` - Persistent state via localStorage
- `src/hooks/useNotifications.js` - Notification state management
- No external state management library (React built-in state + hooks)

## Scripts

```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # Production build (outputs to dist/)
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Key Patterns

1. **Page-per-route** - Each route maps to a dedicated page component in `src/pages/`
2. **Feature-based components** - Components grouped by domain (kanban, briefs, client, etc.)
3. **Primitive-first UI** - Generic UI atoms in `components/ui/` consumed by feature components
4. **Layout wrapping** - `Layout.jsx` provides consistent shell (sidebar + header) around pages
5. **Mock-first data** - `mockData.js` enables frontend development without a backend
