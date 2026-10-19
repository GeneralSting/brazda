---
paths:
  - "src/components/form/**"
  - "src/hooks/use-app-form.ts"
  - "src/hooks/use-form-context.ts"
  - "src/schemas/form-fields.ts"
  - "src/config/form-fields.ts"
  - "src/utils/form.ts"
  - "src/utils/request.ts"
  - "src/types/form.ts"
  - "src/features/**/*form*"
---

# Forms

Every form is built the same way, from the same pieces, with TanStack Form and Zod. Our own pieces never carry the bare name of a native element or a library export (`FormBuilder`, not `Form`), so it is always clear that a custom component is used. `src/features/auth/sign-in` is the reference.

- layers, from the smallest
  - schema - one Zod schema per kind of field with its Croatian messages, shared ones in `#/schemas/form-fields` (email, password - the only password rule is at least 8 characters)
  - field config - `{ schema, defaultValue }`, shared ones in `#/config/form-fields` (`EMAIL_FIELD`, `PASSWORD_FIELD`)
  - form config - `createFormConfig({ email: EMAIL_FIELD, ... })` from `#/utils/form` gives the schema and the default values of the whole form, in `<form-name>-config.ts` in the feature part, next to its `components` folder, together with the schema of the expected server response and the form's own messages
  - form hook - `use-<form-name>.ts` in the feature part, next to its `components` folder: `useAppForm` with the config, `revalidateLogic()` and `validators: { onDynamic: schema }`, the submit, and the error of the whole form; it parses the values with the schema before sending, so the request gets typed, trimmed data
  - form UI - `components/<form-name>.tsx` in the feature part: `FormBuilder` from `#/components/form/form-builder` with `submitText` and `error`, each field as `<form.AppField name="...">` with a field component (`field.TextField`, `field.CheckboxField` for a boolean); the name is checked against the config by TypeScript
- validation
  - a checkbox that has to be checked (accepting the terms) is a boolean field that starts `false` with `z.boolean().refine(...)` - the form can be sent unchecked and then fails with the message under the box, the submit button is never disabled for it
  - the browser's validation is off (`noValidate` in `FormBuilder`), our messages replace it
  - nothing is shown before the first submit; a failed submit shows the error under every wrong field and focuses the first one; after that the messages follow the typing
  - every text field has a label and a placeholder - an example of the value (`ime@primjer.hr`), dots for a password; the placeholder is `text-disabled-foreground`, clearly lighter than typed text, so it is never mistaken for a value
- errors
  - a field error is about that field only and stands under it
  - an error of the whole form (email and password do not match, no answer, server error, unexpected answer) stands between the last field and the submit button, at the same distance from both
  - a failed request is turned into a message with `getRequestErrorMessage` from `#/utils/request`, a form adds only its own reasons, by the error codes in `#/config/auth` - `BETTER_AUTH_ERROR_CODES` are checked against the types of Better Auth, `authClient.$ERROR_CODES` is never read, it exists only as a type and is a proxy at runtime
  - every successful answer is checked with `parseResponse` against the expected schema - a different shape is logged for us and shown to the user as an unexpected error, never trusted
  - a request that throws (no network, no answer) is caught and reported as no answer
- a new kind of field is a new field component in `src/components/form` (e.g. `SelectField`), registered in `fieldComponents` of `#/hooks/use-app-form`; it reads its field with `useFieldContext` and shows only its own error
- the render function given to `form.AppField` is written inline - it is not an event handler, the handler rule does not apply to it
