# To-Do List

A To-Do List application built with React, TypeScript, and IndexedDB. Create, edit, complete, delete, search, and filter tasks — all persisted locally in the browser.

## Features

- **Create** — add a to-do with a title (required) and an optional description
- **Read** — all to-dos are listed, most recent first
- **Update** — edit a to-do's title/description inline, or toggle its completion status
- **Delete** — remove a to-do
- **Search** — filter by text match on title or description
- **Filter by status** — All / Open / Done

Each to-do has: `id`, `title`, `description?`, `created_at`, `completed`.

## Tech stack

- **React 19** + **TypeScript**, functional components and hooks only
- **Vite** for tooling
- **IndexedDB** (native browser API, no wrapper library) for persistence
- **Vitest** + **React Testing Library** for unit tests
- No UI component libraries — all components (form, list, item, filter bar) are built from scratch

## Getting started

### Prerequisites

- Node.js 18+ and npm

### Install

\```bash
npm install
\```

### Run in development

\```bash
npm run dev
\```

The app will be available at `http://localhost:5173`.

### Run tests

\```bash
npm run test        # run once
npm run test:watch  # watch mode
npm run test:ui     # Vitest UI
\```

### Build for production

\```bash
npm run build
npm run preview      # preview the production build locally
\```

## Project structure

\```
src/
├── types.ts                    # Todo, TodoDraft, StatusFilter types
├── lib/
│   ├── db.ts                   # Low-level IndexedDB access (open, getAll, put, remove)
│   └── db.test.ts
├── hooks/
│   ├── useTodos.ts             # CRUD + search/filter state, built on top of lib/db
│   └── useTodos.test.ts
├── components/
│   ├── TodoForm.tsx            # Create a new to-do
│   ├── SearchFilterBar.tsx     # Text search + status filter
│   ├── TodoItem.tsx            # Single row: toggle, inline edit, delete
│   └── TodoList.tsx            # List rendering + empty states
├── App.tsx                     # Wires useTodos to the UI
├── App.css
└── index.css
\```

The app is layered so each piece has one job: `lib/db.ts` only knows how to talk to IndexedDB, `hooks/useTodos.ts` only knows the to-do business logic (CRUD, search, filter) and has no UI code, and `components/` only render what they're given through props. This keeps the persistence layer swappable (e.g. to `localStorage`) without touching the hook or any component.

## Design notes

- **Persistence**: implemented with the native IndexedDB API instead of `localStorage`, since it's better suited to structured records, scales to larger datasets, and keeps read/write operations asynchronous and non-blocking on the main thread. Tests mock it with `fake-indexeddb`, since jsdom doesn't implement IndexedDB natively.
- **State**: `useTodos` owns all to-do state (loaded once from IndexedDB on mount) and derives the filtered/search list with `useMemo`, so filtering never triggers extra database reads.
- **Testing**: 12 unit tests cover the persistence layer (`lib/db.test.ts`) and the hook's CRUD/search/filter behavior (`hooks/useTodos.test.ts`), including edge cases like empty-title submission and combined text+status filtering.