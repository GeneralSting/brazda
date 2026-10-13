# Project engineering guide

- use pnpm as package manager, if there are issues with it, try to fix it instead of using other package managers

## Writing comments

- for single line comment use the inline commenting `// for JS`, for the multiple lines comment use the multi lines commeting sytnax `/* ... */`

## Related to the frontend

- use arrow functions when possible and where it is irrevelant and no downsides over using the normal function syntax
- when giving function to the handler always create specific function in the logic - never create arrow/callback functions isnide the handler because that function is re-created on every render

## Project structure

- structure is based on [bulletproof-react](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md), grouped into three sections inside `src`: `app`, `shared` and `features`
- imports go in one direction only: `shared` -> `features` -> `app`

```sh
src
|
+-- app                   # application (core) layer, wires everything together
|   +-- routes            # file-based routes (TanStack Router), __root.tsx is the document shell
|   +-- router.tsx        # router configuration
|   +-- routeTree.gen.ts  # generated, never edited by hand
|   +-- styles.css        # global styles
|
+-- shared                # components and logic used by app and by more than one feature
|   +-- components        # generic UI components
|   +-- config            # global configuration, env variables
|   +-- hooks             # generic hooks
|   +-- lib               # third party libraries preconfigured for this app
|   +-- types             # types used across the application
|   +-- utils             # generic utility functions
|
+-- features              # biggest section, one folder per feature
    +-- parcels           # example feature
        +-- index.ts      # public API of the feature, the only file other sections import
        +-- api           # server functions and data fetching of the feature
        +-- components    # components scoped to the feature
        +-- hooks         # hooks scoped to the feature
        +-- types         # types used within the feature
        +-- utils         # utility functions of the feature
```

- `app`
  - holds what is global and what connects the features: routes, router, providers, global styles
  - TanStack Start `srcDirectory` is set to `src/app` in `vite.config.ts`, so framework entry files live here
  - routes stay thin - they read params/loaders and compose features, feature logic does not live in a route file
  - can import from `features` (only through the feature `index.ts`) and from `shared`
- `shared`
  - holds code that is not tied to one feature and is used by `app` or by at least two features
  - never imports from `features` or `app`
  - code is moved here when the second consumer shows up, not in advance
- `features`
  - every feature is a separate unit with its own folder
  - can import only from `shared` and from its own folder
  - never imports another feature and never imports `app` - when two features need the same thing it is moved to `shared`, when one screen needs two features they are composed in an `app` route
  - exposes only what is listed in its `index.ts`, with explicit named exports (no `export *`), everything else is private to the feature
  - only the needed inner folders are created, not all of them for every feature
- imports between sections use the `#/` alias (`#/shared/utils/format`, `#/features/parcels`), relative imports are used only inside the same feature or the same `shared` folder
- folders are created when the first file needs them - `shared` and `features` do not exist until then
- these rules are enforced by Biome (`noRestrictedImports` overrides in `biome.json`), `pnpm check` fails when a boundary is crossed

## Writting commit text messages

- Claude never commits - no `git commit` or any other command that writes git history, it only gives me the commit message text which I review and commit myself
- commit message text contains no Claude attribution - no `Co-Authored-By` or "Generated with" lines
- we write multi lines commit messages following this structure
  - first line is type of commit and short title - fix/feat/...: main description of the commit
  - below that goes the bullet points of detailed description of what we all changed, we should commit small changes so there shouldn't be much of bullet points, but when there is we can go into inner bullet point of each bullet point to say what we changed, what problems/bug it solves, what is created by that/updated...
  - after that we can optional brief line telling about does all tests pass, if not why not (we are commiting on the test failure), this line is meant to be for any of the issues that lives while we are commiting, maybe unsolved problems that are too big to be handled by this commit...
- commit message text is written in the passive and we shouldn't reuse verbs, for example - added, added, added...
