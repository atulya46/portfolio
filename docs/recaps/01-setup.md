# Milestone 1 recap: setup

## What was built

An empty but working Next.js site: a placeholder home page with your name, a tagline and the seven section names. It has tests, linting and a production build, all passing. Nothing is styled for real yet; that's milestone 3.

## How the pieces fit

```
src/
  app/              <- every folder here becomes a URL (App Router)
    layout.tsx      <- the shell around every page: <html>, fonts, metadata
    page.tsx        <- the page at "/"
    globals.css     <- global styles and colour tokens
  lib/
    site.ts         <- site name + list of sections (plain data, no UI)
    site.test.ts    <- tests for site.ts
docs/recaps/        <- these recaps
PROJECT.md          <- the anchor file
```

## Key concepts, for a backend engineer

- **Next.js** is a React framework that handles routing, rendering and bundling. Think of it as the Spring Boot of React: conventions over configuration.
- **App Router and file-based routing.** There's no routes table. `src/app/canvas/page.tsx` would automatically serve `/canvas`. Folders are URLs.
- **Server Components.** Pages run on the server by default and send HTML to the browser. Our home page is prerendered at build time into a static HTML file ("○ Static" in the build output), so serving it is as cheap as serving a file. JavaScript in the browser is only added when a component needs interactivity.
- **`layout.tsx` vs `page.tsx`.** A layout wraps every page beneath it, like a servlet filter for HTML. A page is the actual content for one URL.
- **TypeScript.** Types are checked at build time only (`tsc --noEmit`), not at runtime. That's why milestone 2 adds Zod to validate content files at runtime, the same role Pydantic played in your Python project.
- **Tailwind CSS.** Styles are written as small class names (`text-lg`, `px-6`) directly on elements instead of in separate CSS files. It's fast for iterating on design; you won't need to touch it.
- **Vitest** is the test runner, the equivalent of pytest. `npm test` runs every `*.test.ts` file.

## Decisions and trade-offs

- **`src/lib/site.ts` as the single source of truth for sections.** Renaming "Canvas" or adding a section is a one-line change, and pages read from it. The tests check that slugs are unique and URL-safe, because each slug becomes a URL.
- **Tailwind over plain CSS.** It's quicker to build and iterate on the design; the trade-off is noisier markup, which only Claude has to read.
- **`@types/node` pinned to v22** to match Node 22 and keep Vitest's peer dependency happy.
- **`AGENTS.md`** is written by Next.js itself and tells AI assistants that this Next.js version is newer than their training data. `CLAUDE.md` points at it and at PROJECT.md.

## Commands

```bash
npm run dev     # local dev server with hot reload
npm test        # tests
npm run lint    # lint
npm run build   # production build (what Vercel runs)
```

## Where to look if you want to go deeper

- `src/app/layout.tsx`: how every page is wrapped.
- `src/lib/site.ts` and its test: the simplest example of data + test in this codebase.
- `node_modules/next/dist/docs/`: official docs for this exact Next.js version.
