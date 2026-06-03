import { zString, zEmail, zPassword } from "@repo/validation/core";
import { z } from "zod";

export const signInResponseSchema = z.object({
	firstName: zString,
	lastName: zString,
	email: zEmail,
});

export const signUpBodySchema = z.object({
	firstName: zString.meta({ example: "Nick" }),
	lastName: zString.meta({ example: "Fury" }),
	email: zEmail.meta({ example: "nick.fury@example.com" }),
	password: zPassword.meta({ example: "abcd1234" }),
});

export type SignInBody = z.infer<typeof signInBodySchema>;

export const signInBodySchema = z.object({
	email: zEmail,
	password: zPassword,
});

export type SignUpBody = z.infer<typeof signUpBodySchema>;
