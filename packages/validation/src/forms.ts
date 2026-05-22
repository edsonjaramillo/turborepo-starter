import { z } from "zod";

import { zEmail, zPassword, zName } from "./core";

export const signUpFormSchema = z.object({
	name: zName,
	email: zEmail,
	password: zPassword,
});

export type SignUpFormData = z.infer<typeof signUpFormSchema>;

export const signInFormSchema = z.object({
	email: zEmail,
	password: zPassword,
});

export type SignInFormData = z.infer<typeof signInFormSchema>;
