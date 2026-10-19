import type { z } from "zod";

// one field of a form: how it is validated and what it holds before the user types
export type FieldConfig<TSchema extends z.ZodType = z.ZodType> = {
	schema: TSchema;
	defaultValue: z.input<TSchema>;
};

export type FormSchema<TFields extends Record<string, FieldConfig>> =
	z.ZodObject<{
		[K in keyof TFields]: TFields[K]["schema"];
	}>;

export type FormDefaultValues<TFields extends Record<string, FieldConfig>> = {
	[K in keyof TFields]: z.input<TFields[K]["schema"]>;
};
