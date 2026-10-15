# Brazda

- web application for Croatian agricultural holdings (OPG and others): parcels on the cadastral and ARKOD map, records of field work, deadlines and obligations, documents - stock, costs and income, subsidies and prices come later
- web only and online only - no offline mode and no native app, phones use it through the browser
- the interface is in Croatian, code, comments and commit messages are in English
- farming-domain decisions come from the farmer the owner works with, they are never guessed
- stack: TanStack Start (React 19, React Compiler, TypeScript, Vite), Tailwind CSS 4, Base UI, Biome, Drizzle ORM on Neon PostgreSQL (PostGIS available for parcels)
- commands: `pnpm dev`, `pnpm check` (Biome), `pnpm typecheck`, `pnpm build`, `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:studio`

## Rules by area

Rules for one part of the code live in `.claude/rules/` and load on their own when a matching file is read or edited:

- `design-system.md` - tokens, type and spacing scale, motion, base components; for `src/**/*.tsx` and `styles.css`
- `server-and-database.md` - server-only files, environment variables, database; for `*.server.ts`, `src/lib/db`, `drizzle`

## Project engineering guide

- use pnpm as package manager, if there are issues with it, try to fix it instead of using other package managers

## Writing comments

- for single line comment use the inline commenting `// for JS`, for the multiple lines comment use the multi lines commeting sytnax `/* ... */`

## Related to the frontend

- use arrow functions when possible and where it is irrevelant and no downsides over using the normal function syntax
- when giving function to the handler always create specific function in the logic - never create arrow/callback functions inside the handler because that function is re-created on every render

## Size and responsibility of code

- single responsibility - every component, hook and function does one thing; a bigger component is put together from smaller ones, each with its own job, instead of holding all the markup and logic itself
- a file stays under 100 lines and 150 is the upper limit - only markup that cannot be split in a sensible way goes over it
- a component made of several parts gets a folder named after it - the main file has the name of the folder and every part is a file prefixed with it (`sidebar/sidebar.tsx`, `sidebar/sidebar-link.tsx`), `src/components/layout/sidebar` is the reference
- state and effects of a component live in a `use-*.ts` hook next to it, the component only renders (`sidebar/use-sidebar-mode.ts`)
- code that is not a component is split by kind and never mixed in one file - `types.ts` for types, `constants.ts` for fixed data, `utils.ts` for functions, all three in a folder named after the subject, `src/components/layout/navigation` is the reference
  - a type, constant or helper used by one file only stays in that file, it moves to `types.ts`, `constants.ts` or `utils.ts` of its folder when a second file needs it
- files are imported directly (`#/components/layout/navigation/utils`), shared code has no `index.ts` barrel files - `index.ts` is only the public API of a feature. Routes pages can also be entry points to the feature specific logic/UI - it must be inside the routes folder because it is route/page but the specific logic and layout, UI is taken from the feature folder.
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
|   |   +-- _app          # routes rendered inside the application shell (sidebar / tab bar)
|   +-- router.tsx        # router configuration
|   +-- routeTree.gen.ts  # generated, never edited by hand
|   +-- styles.css        # global styles and design tokens
|
+-- features              # biggest section, one folder per feature
|   +-- parcels           # example feature
|       +-- index.ts      # public API of the feature, the only file other sections import
|       +-- api           # server functions and data fetching of the feature
|       +-- components    # components scoped to the feature
|       +-- hooks         # hooks scoped to the feature
|       +-- types         # types used within the feature
|       +-- utils         # utility functions of the feature
|
+-- components            # shared: components used across the application
|   +-- layout            # application shell: page frame, mobile tab bar, mobile menu
|   |   +-- navigation    # destinations of the sidebar, tab bar and menus - types, constants, utils
|   |   +-- sidebar       # collapsible sidebar, one file per part
|   +-- ui                # base components of the design system (button, input, card...)
+-- config                # shared: global configuration, env variables
+-- hooks                 # shared: generic hooks
+-- lib                   # shared: third party libraries preconfigured for this app, cn helper
|   +-- db                # database client and schema (Drizzle, Neon PostgreSQL)
+-- types                 # shared: types used across the application
+-- utils                 # shared: generic utility functions
```

- `app`
  - holds what is global and what connects the features: routes, router, providers, global styles
  - TanStack Start `srcDirectory` is set to `src/app` in `vite.config.ts`, so framework entry files live here
  - routes stay thin - they read params/loaders and compose features, feature logic does not live in a route file
  - a screen that shows the sidebar / tab bar is a route inside `routes/_app`, only a screen that has to hide the shell is a route outside of it
  - a file in `routes` that starts with `-` is not a route, it holds helpers of the routes next to it
  - every screen is wrapped in `Page` from `#/components/layout/page`, which gives the page gutter, the title row and the spacing between blocks
  - a new section is added to the navigation in `#/components/layout/navigation/constants.ts`, the sidebar, the tab bar and the mobile menu all read from it
  - can import from `features` (only through the feature `index.ts`) and from shared code
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
- imports between sections use the `#/` alias (`#/components/ui/button`, `#/lib/utils`, `#/features/parcels`), relative imports only point into the same folder or below it (`./sidebar-link`, `./navigation/utils`), never up with `../`
- folders are created when the first file needs them - `features`, `config`, `hooks`, `types` and `utils` do not exist until then
- these rules are enforced by Biome (`noRestrictedImports` overrides in `biome.json`), `pnpm check` fails when a boundary is crossed

## Writting commit text messages

- Claude never commits - no `git commit` or any other command that writes git history, it only gives me the commit message text which I review and commit myself
- commit message text contains no Claude attribution - no `Co-Authored-By` or "Generated with" lines
- we write multi lines commit messages following this structure
  - first line is type of commit and short title - fix/feat/...: main description of the commit
  - below that goes the bullet points of detailed description of what we all changed, we should commit small changes so there shouldn't be much of bullet points, but when there is we can go into inner bullet point of each bullet point to say what we changed, what problems/bug it solves, what is created by that/updated...
  - after that we can optional brief line telling about does all tests pass, if not why not (we are commiting on the test failure), this line is meant to be for any of the issues that lives while we are commiting, maybe unsolved problems that are too big to be handled by this commit...
- commit message text is written in the passive and we shouldn't reuse verbs, for example - added, added, added...
