# Brazda

Web application for managing agricultural holdings in Croatia: parcels, production records, documents, costs, subsidies and deadlines in one place.

## Stack

- [TanStack Start](https://tanstack.com/start) (React 19, file-based routing, SSR)
- TypeScript
- Vite 8
- React Compiler
- Tailwind CSS 4
- Biome (linting and formatting)

## Development

Requires Node 24 and pnpm 11.

```bash
pnpm install
pnpm dev
```

The dev server runs on http://localhost:3000.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview the production build |
| `pnpm typecheck` | Type-check with `tsc` |
| `pnpm check` | Run Biome lint and format checks |
| `pnpm check --write` | Apply Biome fixes and formatting |
| `pnpm generate-routes` | Regenerate `src/routeTree.gen.ts` |

## Structure

Code in `src` is split into three sections, following [bulletproof-react](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md). Imports go one way: `shared` → `features` → `app`.

- `src/app/` is the application layer: file-based routes in `routes/` (`__root.tsx` is the document shell), `router.tsx`, global styles and the generated `routeTree.gen.ts` (do not edit it).
- `src/shared/` holds components and logic used by the app layer or by more than one feature.
- `src/features/` holds one folder per feature. A feature imports only from `shared` and is used only through its `index.ts`; features never import each other.

`#/*` resolves to `src/*`. The boundaries are enforced by Biome, so `pnpm check` fails when one is crossed.
