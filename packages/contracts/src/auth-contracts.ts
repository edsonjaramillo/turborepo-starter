import { zString, zEmail, zPassword } from "@repo/validation/core";
import { z } from "zod";

export const signInResponseSchema = z.object({
	firstName: zString,
	lastName: zString,
	email: zEmail,
	permissions: z.array(
		z.object({
			id: zString,
			name: zString,
		}),
	),
});

export const signUpBodySchema = z.object({
	firstName: zString.meta({ example: "Nick" }),
	lastName: zString.meta({ example: "Fury" }),
	email: zEmail.meta({ example: "nick.fury@example.com" }),
	password: zPassword.meta({ example: "abcd1234" }),
});

export type SignUpFormData = z.infer<typeof signUpBodySchema>;

export const signInFormSchema = z.object({
	email: zEmail,
	password: zPassword,
});

export type SignInFormData = z.infer<typeof signInFormSchema>;
