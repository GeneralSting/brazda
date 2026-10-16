import type { z } from "zod";

// one field of a form: how it is validated and what it holds before the user types
export type FieldConfig<TSchema extends z.ZodType = z.ZodType> = {
	schema: TSchema;
	defaultValue: z.input<TSchema>;
};
