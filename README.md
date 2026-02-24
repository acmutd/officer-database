<div align="center">
	<h1>ACM Officer Database - Frontend</h1>
	<p>Type-safe React frontend for ACM UTD officer operations, profile management, and directory tooling.</p>
</div>

## Overview

This repository contains the Vite + React frontend for ACM UTD's officer database platform. The app provides authenticated officer workflows, directory browsing, role-aware actions, and executive-level administrative controls.

## Tech Stack

- **Runtime/UI:** React 19, TypeScript, Vite 7
- **Routing:** TanStack Router (file-based routes)
- **Data Fetching/Cache:** TanStack Query
- **Forms/Validation:** React Hook Form + Zod
- **Auth:** Firebase Authentication (Google sign-in)
- **UI Primitives:** Radix UI + custom components
- **Styling:** Tailwind CSS v4

## Architecture

- `src/routes` contains route-level composition and auth-protected navigation.
- `src/components` contains domain UI (Profile, Directory, Socials, etc).
- `src/functions` implements API calls and request authorization.
- `src/queries` defines TanStack Query options/mutations and cache update logic.
- `src/schemas` stores Zod schemas for runtime parsing and type inference.

## Local Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
git clone https://github.com/acmutd/officer-database.git
cd officer-database-frontend
npm install
npm run build
npm run dev
```

App runs at `http://localhost:3000`.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build + TypeScript check
- `npm run serve` — preview production build
- `npm run test` — run Vitest

## Quality & Validation Notes

- Primary gate is `npm run build` (`vite build && tsc`).
- No dedicated lint/format script is currently configured.
- If there are no test files, `npm run test` exits with Vitest “No test files found”.