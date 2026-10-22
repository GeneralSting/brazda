# Brazda

- web application for Croatian agricultural holdings (OPG and others): parcels on the cadastral and ARKOD map, records of field work, deadlines and obligations, documents - stock, costs and income, subsidies and prices come later
- web only and online only - no offline mode and no native app, phones use it through the browser
- the interface is in Croatian, code, comments and commit messages are in English
- farming-domain decisions come from the farmer the owner works with, they are never guessed
- stack: TanStack Start (React 19, React Compiler, TypeScript, Vite), Tailwind CSS 4, Base UI, TanStack Form with Zod, Biome, Drizzle ORM on Neon PostgreSQL (PostGIS available for parcels), Better Auth
- commands: `pnpm dev`, `pnpm check` (Biome), `pnpm typecheck`, `pnpm build`, `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:studio`

## Rules by area

Rules for one part of the code live in `.claude/rules/` and load on their own when a matching file is read or edited:

- `design-system.md` - tokens, type and spacing scale, motion, base components; for `src/**/*.tsx` and `styles.css`
- `server-and-database.md` - server-only files, environment variables, database; for `*.server.ts`, `src/server`, `drizzle`
- `forms.md` - how every form is built (schema, field config, form config, hook, UI) and how errors are shown; for `src/components/form`, the form hooks, schemas, configs and utils, and form files of features

## Project engineering guide

- use pnpm as package manager, if there are issues with it, try to fix it instead of using other package managers

## Writing comments

- a comment of one line uses `//` - a comment about one prop, variant or value sits at the end of its line (`suffix?: ReactNode; // unit or icon shown at the end of the field`), above it only when the line would get too long, a comment about a whole block sits above the block
- a comment of more lines is a JSDoc block, `/**` on its own line, every line of text starting with `*` and ` */` closing it - never `/* ... */`, except inside JSX, where `{/* ... */}` is the only form

## Related to the frontend

- use arrow functions when possible and where it is irrevelant and no downsides over using the normal function syntax
- when giving function to the handler always create specific function in the logic - never create arrow/callback functions inside the handler because that function is re-created on every render

## Size and responsibility of code

- single responsibility - every component, hook and function does one thing; a bigger component is put together from smaller ones, each with its own job, instead of holding all the markup and logic itself
- a file stays under 100 lines and 150 is the upper limit - only markup that cannot be split in a sensible way goes over it
- a component made of several parts gets a folder named after it - the main file has the name of the folder and every part is a file prefixed with it (`sidebar/sidebar.tsx`, `sidebar/sidebar-link.tsx`), `src/components/layout/sidebar` is the reference
- state and effects of a component live in a `use-*.ts` hook, never in the component file, the component only renders - a shared hook in `src/hooks` (`use-sidebar-mode.ts`), a hook of a feature in its part, next to `components` (`use-sign-in-form.ts`)
- code that is not a component is split by kind and never mixed in one file - shared code sits at the top of `src` in a folder of its kind (`types`, `config`, `utils`, `schemas`, `hooks`) with one file per subject: `config/navigation.ts` holds the destinations, `types/navigation.ts` their types, `utils/navigation.ts` the functions over them
  - the props type of a component stays in the component file, it is almost always used only there
  - every other type lives in `src/types` in the file of its subject (`types/form.ts` holds every type about forms), even when only one file uses it yet, so all types of a subject are found in one place
  - a constant or helper used by one file only stays in that file, it moves to the folder of its kind when a second file needs it
- files are imported directly (`#/utils/navigation`), shared code has no `index.ts` barrel files - `index.ts` is only the public API of a feature. Routes pages can also be entry points to the feature specific logic/UI - it must be inside the routes folder because it is route/page but the specific logic and layout, UI is taken from the feature folder.
- files and folders are named in kebab-case after what they hold

## Project structure

- structure is based on [bulletproof-react](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)
- `src` has two named sections, `app` and `features` - everything else in `src` is shared code, there is no separate `shared` folder
- imports go in one direction only: shared code -> `features` -> `app`

```sh
src
|
+-- app                   # application (core) layer, wires everything together
|   +-- routes            # file-based routes (TanStack Router), __root.tsx is the document shell
|   |   +-- aplikacija    # the signed-in application under /aplikacija, rendered inside the shell (sidebar / tab bar)
|   +-- router.tsx        # router configuration
|   +-- routeTree.gen.ts  # generated, never edited by hand
|   +-- styles.css        # global styles and design tokens
|
+-- features              # biggest section, one folder per feature
|   +-- landing           # the public page about Brazda at /
|   +-- auth              # group folder - only keeps related features together, holds no code of its own
|       +-- sign-up       # a feature, built the same way as sign-in
|       +-- sign-out      # a feature with a single hook
|       +-- password-reset  # one process on two pages: the link asked for, then the new password set from it
|       +-- email-verification  # the page the link that confirms an email returns to
|       +-- sign-in       # a feature, everything about signing in
|           +-- index.ts              # public API of the feature, the only file other sections import
|           +-- components            # only .tsx UI of the feature (sign-in-form.tsx...)
|           +-- sign-in-form-config.ts  # logic sits next to components, never inside it
|           +-- use-sign-in-form.ts
|           +-- api, types, utils...  # created when the feature needs them
|
+-- components            # shared: only .tsx UI, grouped by what it is for
|   +-- auth              # pieces of the sign-in and sign-up screens: google-button, email-divider
|   +-- form              # everything typed into and the form engine pieces: input, field, input-field, text-field, FormBuilder...
|   +-- feedback          # tells the state of something: alert, badge, empty-state
|   +-- display           # shows data: card, table, avatar
|   +-- overlay           # opens over the page: dropdown-menu (later dialog, popover)
|   +-- layout            # application shell: page frame, auth page, sidebar, mobile tab bar, mobile menu
|   +-- button.tsx, logo.tsx, reveal.tsx   # single components used everywhere
+-- config                 # shared: fixed data and settings - env, navigation, form fields, product texts
+-- hooks                 # shared: hooks - form engine (use-app-form), sidebar mode, generic ones
+-- schemas               # shared: Zod schemas used by several forms and server functions
+-- server                # shared: code that runs only on the server - Better Auth, database client and tables
+-- services              # shared: clients of outside services used in the browser - Better Auth client
+-- types                 # shared: types used across the application
+-- utils                 # shared: helpers, one file per subject - cn, form, request, navigation, session (route guards), sidebar-mode
```

- `app`
  - holds what is global and what connects the features: routes, router, providers, global styles
  - TanStack Start `srcDirectory` is set to `src/app` in `vite.config.ts`, so framework entry files live here
  - routes stay thin - a route file holds only the route: its options (head, beforeLoad), its layout or page component, composed from features and shared code - guards, loaders and every other helper live in shared code (`requireSignIn` and `skipWhenSignedIn` in `#/utils/session`), feature logic in the feature
  - `/` (the public page about Brazda) and the auth screens (`/prijava`, `/registracija`, `/zaboravljena-lozinka`, `/nova-lozinka`, `/potvrda-e-poste`) are public routes at the top of `routes`
  - every screen of the signed-in application is a route inside `routes/aplikacija` (URL `/aplikacija/...`) - its `route.tsx` is the layout that lets in only a signed-in user and renders the shell around the screen
  - every screen is wrapped in `Page` from `#/components/layout/page`, which gives the page gutter, the title row and the spacing between blocks
  - a screen outside the shell (sign-in, sign-up) is wrapped in `AuthPage` from `#/components/layout/auth-page/auth-page` instead - the form on the left, the green panel on the right from `lg`
  - a new section is added to the navigation in `#/config/navigation.ts`, the sidebar, the tab bar and the mobile menu all read from it
  - can import from `features` (only through the feature `index.ts`, `#/features/auth/sign-in`) and from shared code
- shared code (every `src` folder other than `app` and `features`)
  - holds code that is not tied to one feature and is used by `app` or by at least two features
  - never imports from `features` or `app`
  - code is moved here when the second consumer shows up, not in advance - the design system is the exception, it is global from the start
- `features`
  - a feature is a separate unit that delivers one specific thing (parcels, work records...), with its own folder
  - global things are never a feature - design system, layout, navigation, auth session and similar belong to shared code or `app`
  - can import only from shared code and from its own folder
  - never imports another feature and never imports `app` - when two features need the same thing it is moved to shared code, when one screen needs two features they are composed in an `app` route
  - exposes only what is listed in its `index.ts`, with explicit named exports (no `export *`), everything else is private to the feature
  - only the needed inner folders are created, not all of them for every feature
  - related features can be kept together in a group folder (`auth/sign-in`, `auth/sign-up`, `auth/sign-out`) - the group holds no code, no `index.ts` and no shared folder, every feature in it is as separate as any other and has its own `index.ts`
  - a feature with a single hook or config keeps it as a file next to `components` (`use-sign-in-form.ts`), more of the same kind go into a folder of that kind (`hooks/`, `api/`)
  - what two features need, also two features of one group, is shared code - it moves out of `features` into the folder of its kind (`#/components/auth/google-button`)
- a `components` folder - in a feature or in shared code - holds only `.tsx` UI components, never logic: hooks, configs, schemas, constants and utilities live outside it
- imports between sections use the `#/` alias (`#/components/button`, `#/utils/cn`, `#/features/auth/sign-in`), relative imports only point into the same folder or below it (`./sidebar-link`), never up with `../` - the one exception is inside a feature, where a file may go up within its own feature (`../use-sign-in-form` from `components/`), never out of it
- folders are created when the first file needs them, no empty folders are kept for later
- these rules are enforced by Biome (`noRestrictedImports` overrides in `biome.json`), `pnpm check` fails when a boundary is crossed - a new group folder in `features` gets its exception (`!#/features/<group>/*`) in the `src/app` override, so app can import the features in it through their `index.ts`

## Writting commit text messages

- Claude never commits - no `git commit` or any other command that writes git history, it only gives me the commit message text which I review and commit myself
- commit message text contains no Claude attribution - no `Co-Authored-By` or "Generated with" lines
- we write multi lines commit messages following this structure
  - first line is type of commit and short title - fix/feat/...: main description of the commit
  - below that goes the bullet points of detailed description of what we all changed, we should commit small changes so there shouldn't be much of bullet points, but when there is we can go into inner bullet point of each bullet point to say what we changed, what problems/bug it solves, what is created by that/updated...
  - after that we can optional brief line telling about does all tests pass, if not why not (we are commiting on the test failure), this line is meant to be for any of the issues that lives while we are commiting, maybe unsolved problems that are too big to be handled by this commit...
- commit message text is written in the passive and we shouldn't reuse verbs, for example - added, added, added...
