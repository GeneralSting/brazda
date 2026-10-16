---
paths:
  - "src/**/*.tsx"
  - "src/app/styles.css"
  - "components.json"
---

# Design system

- the design system is global - it is CSS tokens plus base components, used through the whole application, never a feature and never a page of its own
- our design system - the tokens and utilities in `styles.css`, the base components and the rules in this file - is the only source of truth; the Claude Design project "Njiva: poljoprivredna aplikacija" (`Njiva.dc.html`) is a reference for layout and content of the screens (section 0 the original system, 1-7 the application, 8 sign-in and sign-up), never for sizes, colours or type
  - a screen from the design is rebuilt with what the system already has, its sizes are mapped onto our scale - a new token, utility or size is not added to match the design
  - something new enters the system only when nothing in it can do the job, it is agreed first and then written into this file
- design tokens (colours, radius, font) live in `src/app/styles.css` and are named after the shadcn/ui convention - colours are used through the token classes (`bg-primary`, `text-muted-foreground`, `border-border-subtle`), never as hex values in components
- everything visual comes from a fixed set of classes defined in `src/app/styles.css` or from the default Tailwind scale - a screen is put together by picking from the lists below, not by inventing values
  - no arbitrary values (`text-[15px]`, `p-[13px]`, `leading-[22px]`), the only exception is something truly one-off such as a grid template
  - all sizes are even pixel values and go in steps - a smaller text is the next step down (18px -> 16px -> 14px), never 1px less
  - a value that is truly missing (see above, agreed first) is added to `styles.css` as a named token or utility and then used, it is not written inline
- text - only the type scale utilities, font size and line height are never set separately

  | class                | mobile               | desktop (`lg`)       | use                                |
  | -------------------- | -------------------- | -------------------- | ---------------------------------- |
  | `type-page-title`    | 26/32 bold           | 28/36 bold           | title of a page                    |
  | `type-section-title` | 20/28 bold           | 20/28 bold           | title of a section or a card group |
  | `type-body`          | 18/28                | 16/24                | default text, set on `body`        |
  | `type-label`         | 16/24 semibold       | 16/24 semibold       | label of a field                   |
  | `type-small`         | 16/24                | 14/20                | hints, captions, meta lines        |
  | `type-overline`      | 14/20 bold uppercase | 14/20 bold uppercase | label above a group of items       |
  - emphasis is added with `font-semibold` or `font-bold` on top of a type class - an item title is `type-body font-bold`
  - the design screens also use in-between sizes (13px, 15px, 17px, 19px), those are rounded to the nearest step of the scale
  - inside the base components fixed sizes use the Tailwind steps `text-sm` (14px), `text-base` (16px), `text-lg` (18px) - buttons, badges, fields and tables do not change size between mobile and desktop
  - 14px is the smallest text in the interface

- spacing - the default Tailwind scale, only steps that give an even pixel value, multiples of 4px preferred

  | step | px  | use                                           |
  | ---- | --- | --------------------------------------------- |
  | `1`  | 4   | icon and text                                 |
  | `2`  | 8   | inside a group, minimum between touch targets |
  | `3`  | 12  | between related rows                          |
  | `4`  | 16  | inside a card                                 |
  | `5`  | 20  | page edge on mobile (through `page-gutter`)   |
  | `6`  | 24  | between cards and sections                    |
  | `8`  | 32  | above and below page content on desktop       |
  | `10` | 40  | page edge on desktop (through `page-gutter`)  |
  - the in-between even steps (`0.5`, `1.5`, `2.5`, `3.5`) are for the inside of small components only
  - the page edge is always the `page-gutter` utility, never a hand written padding
  - two breakpoints carry the layout - below `md` (768px) the mobile tab bar, from `md` the sidebar; text sizes and the page gutter switch to their desktop values at `lg` (1024px)
  - the sidebar has two widths, full and a rail of icons - the rail is the default between `md` and `lg`, the user can switch at any width with the row at the bottom of the sidebar and the choice is remembered on the device
  - styles that depend on the sidebar width use the `rail:` variant from `styles.css` (`rail:hidden`, `rail:w-18`), never JavaScript, so the server renders the same markup for every screen

- shadows are used only on menus, popovers and dialogs, through `shadow-popover`
- motion - a change of state is animated, simply and briefly, nothing bounces and nothing plays in sequence
  - hover, selection and open/close use a transition of colour, opacity, width or transform - `transition-colors`, `transition-opacity`, `transition-[width]`, `transition-transform`
  - one duration everywhere, `duration-200`, with `ease-out` for changes of size
  - elements are faded or clipped during a change instead of being added and removed, so nothing jumps - the sidebar is the reference: only its width animates, rows keep their icon in place and clip their label
  - content that appears under other content (a message under a field) opens with `Reveal`, which grows its height while fading, so what is below slides down
  - reduced motion is handled once in `styles.css` for the whole application, components do not repeat it
- keyboard focus is styled globally in `styles.css`, buttons and fields draw their own ring - focus styles are never removed without a replacement
- base components are written by hand after the design (arrow functions, `cva` variants, `cn` from `#/utils/cn`) and grouped in `src/components` by what they are for, there is no `ui` folder:
  - `form` - input, password-input, field, field-message, input-field and the form engine pieces
  - `feedback` - alert (error and warning tone), badge, empty-state
  - `display` - card, table, avatar
  - `overlay` - dropdown-menu
  - at the root - button, reveal, logo
  - a component with behaviour that is hard to get right by hand (menu, dialog, select - keyboard, focus, position on the screen) takes that behaviour from Base UI (`@base-ui/react`) and only its look from us, `dropdown-menu.tsx` is the reference
  - a new screen is built from these first, a new base component is added only when the design shows one that is missing
  - `components.json` points the shadcn CLI to the same folders, so a missing component can be pulled with `pnpm dlx shadcn@latest add <name>` and then adjusted to the tokens
  - shadcn offers to overwrite existing files such as `button.tsx` when the new component depends on them - that is always declined
- a text field in a form is always `field.TextField`, which is `InputField` bound to the form - label, field and the message under it as one component, so every label has the same font and the same distance to its field - whatever sits in the label row (a badge, "Zaboravili ste?") gets the label's 16px type; `Field` alone is only for a control that is not a text field
- sizes from the design - main button 56px (`size="lg"`), other buttons 48px, fields always 48px with no exception, table row 52px, radius 10px for buttons and fields (`rounded-control`) and 12px for cards (`rounded-xl`)
- green is reserved for actions and the selected state, red for urgent and errors, amber for soon and values to check - colour is never the only signal, an icon and a word always go with it
- icons come from `lucide-react`
