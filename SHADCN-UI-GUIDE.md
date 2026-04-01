# shadcn/ui Usage Guide

A reference guide for using shadcn/ui with this Vite + React project.

## Table of Contents

- [What is shadcn/ui?](#what-is-shadcnui)
- [Source Reference](#source-reference)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Configuration](#project-configuration)
- [Adding Components](#adding-components)
- [Available Components](#available-components)
- [Component Anatomy](#component-anatomy)
- [The `cn()` Utility](#the-cn-utility)
- [Styling & Theming](#styling--theming)
- [Using with Existing Custom Components](#using-with-existing-custom-components)
- [Documentation Site Components](#documentation-site-components-appsv4components)
- [Common Patterns](#common-patterns)

---

## What is shadcn/ui?

shadcn/ui is **not** a component library — it is a collection of reusable components that you copy into your project and own. Built on top of:

- **Radix UI** — unstyled, accessible primitives
- **Tailwind CSS** — utility-first styling
- **class-variance-authority (cva)** — variant-based component styling
- **tailwind-merge** — intelligent Tailwind class merging
- **lucide-react** — icon library

Key principles:
- You own the code — components are copied into your project, not installed as dependencies
- Full customization — modify any component to fit your needs
- Accessible by default — built on Radix UI primitives
- Tailwind-native — no CSS-in-JS, no runtime styles

---

## Source Reference

The full shadcn/ui source repository is available at:

```
shadcn-ui-main/
├── apps/v4/                    # Documentation site & component registry
│   ├── registry/new-york-v4/   # Component source code (New York style)
│   │   ├── ui/                 # All 57 UI components (installable)
│   │   ├── lib/                # Utilities (cn function)
│   │   ├── hooks/              # Shared hooks
│   │   └── blocks/             # Full-page block examples
│   ├── components/             # 58 docs site components (reference)
│   │   ├── cards/              # 14 demo card examples
│   │   ├── command-menu.tsx    # Cmd+K command palette
│   │   ├── component-preview.tsx
│   │   ├── theme-provider.tsx
│   │   └── ...                 # Nav, code display, theming, etc.
│   ├── components.json         # shadcn/ui config file
│   └── registry.json           # Component registry metadata
├── packages/shadcn/            # The CLI tool (npx shadcn)
└── templates/                  # Starter templates per framework
    ├── vite-app/               # Vite + React template
    ├── next-app/               # Next.js template
    ├── react-router-app/       # React Router template
    └── ...
```

---

## Prerequisites

| Dependency | Purpose |
|------------|---------|
| React 18+ | UI framework |
| Tailwind CSS v4 | Styling (via `@tailwindcss/vite`) |
| `clsx` | Conditional class joining |
| `tailwind-merge` | Deduplication of Tailwind classes |
| `class-variance-authority` | Variant definitions |
| `lucide-react` | Icons |
| `@radix-ui/*` | Accessible primitives (installed per component) |

---

## Installation

### 1. Install the CLI

```bash
npx shadcn@latest init
```

This creates a `components.json` and installs core dependencies.

### 2. Install Dependencies Manually (Alternative)

```bash
npm install clsx tailwind-merge class-variance-authority lucide-react
```

Per-component Radix dependencies are installed automatically when you add a component via the CLI.

### 3. Add a Path Alias

In `vite.config.js`, add a `@` alias pointing to `src/`:

```js
import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

---

## Project Configuration

### `components.json`

The CLI generates this config file:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

Key fields:
- **`style`** — `"new-york"` or `"default"` (visual style variant)
- **`tsx`** — `true` for TypeScript, `false` for JSX
- **`tailwind.css`** — path to your main CSS file
- **`aliases`** — import path aliases for components and utils

---

## Adding Components

### Via CLI (Recommended)

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add --all    # Add all components
```

The CLI will:
1. Install required Radix UI dependencies
2. Copy the component file to `src/components/ui/`
3. Create `src/lib/utils.ts` if it doesn't exist

### Manual Copy

Copy component files directly from:

```
shadcn-ui-main/apps/v4/registry/new-york-v4/ui/<component>.tsx
```

Then install the required Radix dependencies listed in the component's imports.

---

## Available Components

57 components are available in the New York v4 style:

| Category | Components |
|----------|------------|
| **Layout** | `card`, `separator`, `aspect-ratio`, `resizable`, `scroll-area` |
| **Navigation** | `breadcrumb`, `navigation-menu`, `pagination`, `tabs`, `menubar`, `sidebar` |
| **Forms** | `button`, `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`, `slider`, `label`, `form`, `input-otp`, `native-select` |
| **Overlays** | `dialog`, `alert-dialog`, `sheet`, `drawer`, `popover`, `hover-card`, `dropdown-menu`, `context-menu`, `tooltip` |
| **Data Display** | `table`, `badge`, `avatar`, `skeleton`, `progress`, `accordion`, `collapsible`, `calendar`, `carousel`, `chart`, `empty` |
| **Feedback** | `alert`, `sonner`, `spinner` |
| **Command** | `command`, `combobox` |
| **Toggle** | `toggle`, `toggle-group` |
| **Other** | `kbd`, `input-group`, `button-group`, `item`, `field` |

---

## Component Anatomy

Every shadcn/ui component follows this pattern:

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

function ComponentName({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="component-name"           // Identifies component part
      className={cn("base-styles...", className)}  // Merges base + overrides
      {...props}
    />
  )
}

export { ComponentName }
```

### Key Conventions

1. **`data-slot`** — Identifies each part of a compound component (e.g., `card-header`, `card-content`)
2. **`cn()` for className merging** — Base styles + user overrides
3. **Spread `...props`** — Full HTML attribute passthrough
4. **Compound components** — Complex components export multiple sub-components (e.g., `Card`, `CardHeader`, `CardTitle`, `CardContent`)

### Variants with `cva`

Components like `Button` use `class-variance-authority` for variants:

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva("base-styles...", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      destructive: "bg-destructive text-white",
      outline: "border bg-background",
      secondary: "bg-secondary text-secondary-foreground",
      ghost: "hover:bg-accent",
      link: "text-primary underline",
    },
    size: {
      default: "h-9 px-4 py-2",
      sm: "h-8 px-3",
      lg: "h-10 px-6",
      icon: "size-9",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})
```

---

## The `cn()` Utility

Located at `src/lib/utils.ts` (or `src/utils/helpers.js` in this project):

```tsx
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**What it does:**
- `clsx()` — Joins conditional class strings: `cn("base", isActive && "active", className)`
- `twMerge()` — Deduplicates conflicting Tailwind classes: `cn("px-4", "px-6")` → `"px-6"`

**Usage:**

```tsx
// Basic
<div className={cn("p-4 bg-white", className)} />

// Conditional
<div className={cn("text-sm", isError && "text-destructive")} />

// Override defaults
<Button className={cn(buttonVariants({ variant: "outline" }), "w-full")} />
```

---

## Styling & Theming

### CSS Variables

shadcn/ui uses CSS custom properties for theming. Add these to your `src/index.css`:

```css
@import "tailwindcss";

@layer base {
  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.145 0 0);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.145 0 0);
    --primary: oklch(0.205 0.042 265.755);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.97 0 0);
    --secondary-foreground: oklch(0.205 0.042 265.755);
    --muted: oklch(0.97 0 0);
    --muted-foreground: oklch(0.556 0 0);
    --accent: oklch(0.97 0 0);
    --accent-foreground: oklch(0.205 0.042 265.755);
    --destructive: oklch(0.577 0.245 27.325);
    --destructive-foreground: oklch(0.985 0 0);
    --border: oklch(0.922 0 0);
    --input: oklch(0.922 0 0);
    --ring: oklch(0.708 0.165 254.624);
    --radius: 0.625rem;
  }

  .dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    /* ... dark mode overrides */
  }
}
```

### Registering Tailwind Theme

For Tailwind v4, register the theme in your CSS:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-destructive: var(--destructive);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius: var(--radius);
}
```

---

## Using with Existing Custom Components

This project already has custom UI components in `src/components/ui/`. To integrate shadcn/ui components alongside them:

### Option A: Gradual Migration

1. Install the `cn` utility from shadcn/ui:
   ```bash
   npm install clsx tailwind-merge
   ```

2. Create `src/lib/utils.ts` with the standard `cn` function (or update `src/utils/helpers.js`)

3. Add shadcn/ui components via CLI — they go into `src/components/ui/`

4. Update `components.json` aliases if your paths differ:
   ```json
   {
     "aliases": {
       "ui": "@/components/ui",
       "utils": "@/utils/helpers"
     }
   }
   ```

### Option B: Replace Custom Components

Replace existing custom components with shadcn/ui equivalents:

| Current Component | shadcn/ui Equivalent |
|-------------------|---------------------|
| `Button.jsx` | `button.tsx` |
| `Card.jsx` | `card.tsx` |
| `Modal.jsx` | `dialog.tsx` or `sheet.tsx` |
| `Badge.jsx` | `badge.tsx` |
| `Avatar.jsx` | `avatar.tsx` |
| `ProgressBar.jsx` | `progress.tsx` |
| `Tooltip.jsx` | `tooltip.tsx` |

---

## Common Patterns

### Compound Component Usage

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function ClientCard({ client }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{client.name}</CardTitle>
        <CardDescription>{client.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Status: {client.status}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">View Details</Button>
      </CardFooter>
    </Card>
  )
}
```

### Dialog (replaces custom Modal)

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

function ConfirmDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Variant Customization

```tsx
<Button variant="destructive" size="sm">
  Delete
</Button>

<Button variant="outline" size="lg" className="w-full">
  Full Width
</Button>

<Button variant="ghost" size="icon">
  <SettingsIcon />
</Button>
```

### Custom Component Extension

```tsx
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Extend with additional styles
function LoadingButton({ isLoading, children, ...props }) {
  return (
    <Button
      className={cn(isLoading && "opacity-50 pointer-events-none")}
      {...props}
    >
      {isLoading && <Spinner className="mr-2" />}
      {children}
    </Button>
  )
}
```

---

## Documentation Site Components (`apps/v4/components/`)

The `shadcn-ui-main/apps/v4/components/` directory contains **58 components** used by the shadcn/ui documentation website itself. These are **not** part of the installable component registry — they power the docs site's UI for previewing, navigating, and demonstrating components.

These are useful as **reference implementations** showing how to compose shadcn/ui registry components into higher-order features.

### Directory Structure

```
apps/v4/components/
├── cards/                    # 14 demo card examples
│   ├── activity-goal.tsx
│   ├── calendar.tsx
│   ├── chat.tsx
│   ├── cookie-settings.tsx
│   ├── create-account.tsx
│   ├── exercise-minutes.tsx
│   ├── forms.tsx
│   ├── payment-method.tsx
│   ├── payments.tsx
│   ├── report-issue.tsx
│   ├── share.tsx
│   ├── stats.tsx
│   └── team-members.tsx
├── (58 site-level components)
└── ...
```

### Site Components by Category

#### Navigation & Layout

| Component | File | Purpose |
|-----------|------|---------|
| `SiteHeader` | `site-header.tsx` | Main header bar with logo, nav, command menu, theme toggle |
| `SiteFooter` | `site-footer.tsx` | Site footer |
| `MainNav` | `main-nav.tsx` | Primary desktop navigation |
| `MobileNav` | `mobile-nav.tsx` | Responsive mobile navigation drawer |
| `DocsSidebar` | `docs-sidebar.tsx` | Documentation sidebar navigation |
| `DocsToc` | `docs-toc.tsx` | Table of contents for doc pages |
| `DocsBreadcrumb` | `docs-breadcrumb.tsx` | Breadcrumb trail for docs |
| `PageNav` | `page-nav.tsx` | Previous/Next page navigation |
| `NavHeader` | `nav-header.tsx` | Section navigation header |
| `NavUser` | `nav-user.tsx` | User avatar/menu in nav |
| `ExamplesNav` | `examples-nav.tsx` | Navigation for example pages |
| `ChartsNav` | `charts-nav.tsx` | Navigation for chart examples |
| `BlocksNav` | `blocks-nav.tsx` | Navigation for block examples |
| `ColorsNav` | `colors-nav.tsx` | Navigation for color pages |
| `PageHeader` | `page-header.tsx` | Composable page header (`PageHeader`, `PageHeaderHeading`, `PageHeaderDescription`, `PageActions`) |
| `DocsPageLinks` | `docs-page-links.tsx` | External links on doc pages |
| `DocsBaseSwitcher` | `docs-base-switcher.tsx` | Style base switcher (default/new-york) |
| `DocsCopyPage` | `docs-copy-page.tsx` | Copy page content button |
| `MainNav` | `main-nav.tsx` | Primary navigation |
| `TailwindIndicator` | `tailwind-indicator.tsx` | Debug indicator showing current breakpoint |

#### Component Preview & Source

| Component | File | Purpose |
|-----------|------|---------|
| `ComponentPreview` | `component-preview.tsx` | Live component preview with tabs (renders registry components or block iframes) |
| `ComponentSource` | `component-source.tsx` | Syntax-highlighted source code display with copy button |
| `ComponentPreviewTabs` | `component-preview-tabs.tsx` | Tab wrapper for preview/code/example views |
| `ComponentWrapper` | `component-wrapper.tsx` | Wrapper container for component demos |
| `ComponentsList` | `components-list.tsx` | List of all available components |
| `BlockDisplay` | `block-display.tsx` | Full-page block preview display |
| `BlockImage` | `block-image.tsx` | Block preview image (light/dark) |
| `BlockViewer` | `block-viewer.tsx` | Interactive block viewer with source |

#### Code Display

| Component | File | Purpose |
|-----------|------|---------|
| `CodeBlockCommand` | `code-block-command.tsx` | Multi-package-manager install command tabs (pnpm/npm/yarn/bun) |
| `CodeCollapsibleWrapper` | `code-collapsible-wrapper.tsx` | Collapsible code block with expand/collapse |
| `CodeTabs` | `code-tabs.tsx` | Tabbed code view |
| `CopyButton` | `copy-button.tsx` | Clipboard copy button with icon toggle feedback |
| `ChartCodeViewer` | `chart-code-viewer.tsx` | Chart-specific code viewer |
| `ChartCopyButton` | `chart-copy-button.tsx` | Chart copy button |
| `OpenInV0Button` | `open-in-v0-button.tsx` | "Open in v0" button (Vercel integration) |
| `OpenInV0Cta` | `open-in-v0-cta.tsx` | CTA banner for v0 |

#### Charts

| Component | File | Purpose |
|-----------|------|---------|
| `ChartDisplay` | `chart-display.tsx` | Chart preview display |
| `ChartIframe` | `chart-iframe.tsx` | Iframe-based chart preview |
| `ChartToolbar` | `chart-toolbar.tsx` | Chart controls toolbar |

#### Theming

| Component | File | Purpose |
|-----------|------|---------|
| `ThemeProvider` | `theme-provider.tsx` | Wraps `next-themes` with `D` key shortcut for dark mode |
| `ModeSwitcher` | `mode-switcher.tsx` | Sun/moon theme toggle button + iframe dark mode forwarding |
| `ActiveTheme` | `active-theme.tsx` | Active theme context/hook |
| `ThemeCustomizer` | `theme-customizer.tsx` | Theme customization panel |
| `ThemeSelector` | `theme-selector.tsx` | Theme selection dropdown |

#### Command Palette

| Component | File | Purpose |
|-----------|------|---------|
| `CommandMenu` | `command-menu.tsx` | Full Cmd+K command palette — searches docs, colors, blocks, components. Supports Cmd+C to copy selected item |

#### Colors

| Component | File | Purpose |
|-----------|------|---------|
| `Color` | `color.tsx` | Single color swatch display |
| `ColorPalette` | `color-palette.tsx` | Full color palette grid |
| `ColorFormatSelector` | `color-format-selector.tsx` | Color format picker (OKLCH, HSL, RGB, Hex) |

#### Other

| Component | File | Purpose |
|-----------|------|---------|
| `Callout` | `callout.tsx` | Alert callout (wraps `Alert` with title/icon/variant) |
| `Announcement` | `announcement.tsx` | Announcement banner |
| `Analytics` | `analytics.tsx` | Analytics tracking wrapper |
| `SiteConfig` | `site-config.tsx` | Site configuration |
| `GitHubLink` | `github-link.tsx` | GitHub repository link |
| `LanguageSelector` | `language-selector.tsx` | Code language selector |
| `DirectoryList` | `directory-list.tsx` | Directory listing component |
| `DirectoryAddButton` | `directory-add-button.tsx` | Add directory entry button |
| `SearchDirectory` | `search-directory.tsx` | Directory search |

### Demo Cards (`cards/`)

14 pre-built card examples showing real-world UI patterns. Each composes shadcn/ui registry components (Card, Button, Input, Switch, Avatar, etc.) into complete feature cards:

| Card | Pattern |
|------|---------|
| `activity-goal.tsx` | Progress/stat tracking card |
| `calendar.tsx` | Calendar date picker card |
| `chat.tsx` | Chat/messaging card |
| `cookie-settings.tsx` | Settings with switches |
| `create-account.tsx` | Registration form card |
| `exercise-minutes.tsx` | Data visualization card |
| `forms.tsx` | Multi-field form card |
| `payment-method.tsx` | Payment form card |
| `payments.tsx` | Transaction list card |
| `report-issue.tsx` | Bug report form card |
| `share.tsx` | Social sharing card |
| `stats.tsx` | Statistics/KPI card |
| `team-members.tsx` | User list card |

### Key Reference Components

#### `ComponentPreview` — How to Render Registry Components

```tsx
// Shows how shadcn/ui dynamically loads and renders components
// from the registry. Useful pattern for building your own
// component gallery or documentation.

<ComponentPreview name="button" type="component" />
<ComponentPreview name="login-01" type="block" />
```

#### `CommandMenu` — Building a Command Palette

```tsx
// Full implementation of Cmd+K search using:
// - Dialog (overlay)
// - Command (cmdk) for search UI
// - fumadocs-core for search indexing
// - Debounced search with analytics

<CommandMenu tree={pageTree} colors={colors} blocks={blocks} />
```

#### `ThemeProvider` — Dark Mode Integration

```tsx
// Wraps next-themes with class-based toggling
// Includes iframe-aware dark mode forwarding
// Works with the CSS variables defined in index.css

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

#### `CodeBlockCommand` — Multi-Package-Manager Commands

```tsx
// Renders install commands for pnpm/npm/yarn/bun in tabs
// Persists user's preferred package manager via useConfig

<CodeBlockCommand
  __npm__="npx shadcn@latest add button"
  __yarn__="yarn shadcn add button"
  __pnpm__="pnpm dlx shadcn@latest add button"
  __bun__="bunx --bun shadcn@latest add button"
/>
```

---

## Quick Reference

```bash
# Initialize shadcn/ui in project
npx shadcn@latest init

# Add individual components
npx shadcn@latest add button card dialog

# Add all components
npx shadcn@latest add --all

# Update components (re-fetches from registry)
npx shadcn@latest diff
npx shadcn@latest add button  # re-adds updated version
```

## Resources

- **Official Docs**: https://ui.shadcn.com/docs
- **Source**: `shadcn-ui-main/` in this repository
- **Installable Components (Registry)**: `shadcn-ui-main/apps/v4/registry/new-york-v4/ui/`
- **Docs Site Components (Reference)**: `shadcn-ui-main/apps/v4/components/`
- **Demo Cards**: `shadcn-ui-main/apps/v4/components/cards/`
- **Templates**: `shadcn-ui-main/templates/`
