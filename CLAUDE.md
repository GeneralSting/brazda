# Project engineering guide

- use pnpm as package manager, if there are issues with it, try to fix it instead of using other package managers

## Writing comments

- for single line comment use the inline commenting `// for JS`, for the multiple lines comment use the multi lines commeting sytnax `/* ... */`

## Related to the frontend

- use arrow functions when possible and where it is irrevelant and no downsides over using the normal function syntax
- when giving function to the handler always create specific function in the logic - never create arrow/callback functions isnide the handler because that function is re-created on every render

## Project structure

- structure is based on [bulletproof-react](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)
- `src` has two named sections, `app` and `features` - everything else in `src` is shared code, there is no separate `shared` folder
- imports go in one direction only: shared code -> `features` -> `app`

```sh
src
|
+-- app                   # application (core) layer, wires everything together
|   +-- routes            # file-based routes (TanStack Router), __root.tsx is the document shell
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
|   +-- ui                # base components of the design system (button, input, card...)
+-- config                # shared: global configuration, env variables
+-- hooks                 # shared: generic hooks
+-- lib                   # shared: third party libraries preconfigured for this app, cn helper
+-- types                 # shared: types used across the application
+-- utils                 # shared: generic utility functions
```

- `app`
  - holds what is global and what connects the features: routes, router, providers, global styles
  - TanStack Start `srcDirectory` is set to `src/app` in `vite.config.ts`, so framework entry files live here
  - routes stay thin - they read params/loaders and compose features, feature logic does not live in a route file
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
- imports between sections use the `#/` alias (`#/components/ui/button`, `#/lib/utils`, `#/features/parcels`), relative imports are used only inside the same feature or the same shared folder
- folders are created when the first file needs them - `features`, `config`, `hooks`, `types` and `utils` do not exist until then
- these rules are enforced by Biome (`noRestrictedImports` overrides in `biome.json`), `pnpm check` fails when a boundary is crossed

## Design system

- the design system is global - it is CSS tokens plus base components, used through the whole application, never a feature and never a page of its own
- source of the design is the Claude Design project "Njiva: poljoprivredna aplikacija" (`Njiva.dc.html`), section 0 is the design system and sections 1-7 are the screens, each for mobile (390px) and desktop (1280px)
- design tokens (colours, radius, font) live in `src/app/styles.css` and are named after the shadcn/ui convention - colours are used through the token classes (`bg-primary`, `text-muted-foreground`, `border-border-subtle`), never as hex values in components
- everything visual comes from a fixed set of classes defined in `src/app/styles.css` or from the default Tailwind scale - a screen is put together by picking from the lists below, not by inventing values
  - no arbitrary values (`text-[15px]`, `p-[13px]`, `leading-[22px]`), the only exception is something truly one-off such as a grid template
  - all sizes are even pixel values and go in steps - a smaller text is the next step down (18px -> 16px -> 14px), never 1px less
  - a value that is missing is added to `styles.css` as a named token or utility first and then used, it is not written inline
- text - only the type scale utilities, font size and line height are never set separately

  | class | mobile | desktop (`lg`) | use |
  | --- | --- | --- | --- |
  | `type-page-title` | 26/32 bold | 28/36 bold | title of a page |
  | `type-section-title` | 20/28 bold | 20/28 bold | title of a section or a card group |
  | `type-body` | 18/28 | 16/24 | default text, set on `body` |
  | `type-label` | 16/24 semibold | 16/24 semibold | label of a field |
  | `type-small` | 16/24 | 14/20 | hints, captions, meta lines |
  | `type-overline` | 14/20 bold uppercase | 14/20 bold uppercase | label above a group of items |

  - emphasis is added with `font-semibold` or `font-bold` on top of a type class - an item title is `type-body font-bold`
  - the design screens also use in-between sizes (13px, 15px, 17px, 19px), those are rounded to the nearest step of the scale
  - inside the base components fixed sizes use the Tailwind steps `text-sm` (14px), `text-base` (16px), `text-lg` (18px) - buttons, badges, fields and tables do not change size between mobile and desktop
  - 14px is the smallest text in the interface
- spacing - the default Tailwind scale, only steps that give an even pixel value, multiples of 4px preferred

  | step | px | use |
  | --- | --- | --- |
  | `1` | 4 | icon and text |
  | `2` | 8 | inside a group, minimum between touch targets |
  | `3` | 12 | between related rows |
  | `4` | 16 | inside a card |
  | `5` | 20 | page edge on mobile (through `page-gutter`) |
  | `6` | 24 | between cards and sections |
  | `8` | 32 | above and below page content on desktop |
  | `10` | 40 | page edge on desktop (through `page-gutter`) |

  - the in-between even steps (`0.5`, `1.5`, `2.5`, `3.5`) are for the inside of small components only
  - the page edge is always the `page-gutter` utility, never a hand written padding
  - `lg` (1024px) is the single switch between the mobile and the desktop layout
- shadows are used only on menus, popovers and dialogs, through `shadow-popover`
- keyboard focus is styled globally in `styles.css`, buttons and fields draw their own ring - focus styles are never removed without a replacement
- base components live in `src/components/ui` and are written by hand after the design (arrow functions, `cva` variants, `cn` from `#/lib/utils`) - button, input, field, badge, card, table, alert (error and warning tone), empty-state, plus `src/components/logo.tsx`
  - a new screen is built from these first, a new base component is added only when the design shows one that is missing
  - `components.json` points the shadcn CLI to the same folders, so a missing component can be pulled with `pnpm dlx shadcn@latest add <name>` and then adjusted to the tokens
  - shadcn offers to overwrite existing files such as `button.tsx` when the new component depends on them - that is always declined
- sizes from the design - main button 56px (`size="lg"`), other buttons and fields 48px, table row 52px, radius 10px for buttons and fields (`rounded-control`) and 12px for cards (`rounded-xl`)
- green is reserved for actions and the selected state, red for urgent and errors, amber for soon and values to check - colour is never the only signal, an icon and a word always go with it
- icons come from `lucide-react`

## Writting commit text messages

- Claude never commits - no `git commit` or any other command that writes git history, it only gives me the commit message text which I review and commit myself
- commit message text contains no Claude attribution - no `Co-Authored-By` or "Generated with" lines
- we write multi lines commit messages following this structure
  - first line is type of commit and short title - fix/feat/...: main description of the commit
  - below that goes the bullet points of detailed description of what we all changed, we should commit small changes so there shouldn't be much of bullet points, but when there is we can go into inner bullet point of each bullet point to say what we changed, what problems/bug it solves, what is created by that/updated...
  - after that we can optional brief line telling about does all tests pass, if not why not (we are commiting on the test failure), this line is meant to be for any of the issues that lives while we are commiting, maybe unsolved problems that are too big to be handled by this commit...
- commit message text is written in the passive and we shouldn't reuse verbs, for example - added, added, added...
