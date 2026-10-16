import { type ClassNameValue, twMerge } from "tailwind-merge";

/* Joins the truthy class names, so conditional classes can be written inline,
   and resolves conflicting Tailwind utilities - the last one wins. */
export const cn = (...classes: ClassNameValue[]) => twMerge(...classes);
