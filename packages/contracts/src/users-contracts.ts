import { zEmail, zPassword, zString } from "@repo/validation/core";
import { z } from "zod";

export const userResponseSchema = z.object({
	id: zString,
	firstName: zString,
	lastName: zString,
	email: zEmail,
});

export const createUserBodySchema = z.object({
	firstName: zString.meta({ example: "Tony" }),
	lastName: zString.meta({ example: "Stark" }),
	email: zEmail.meta({ example: "tony.stark@example.com" }),
	password: zPassword.meta({ example: "abcd1234" }),
});
