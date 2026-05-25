import { zEmail, zPassword, zString } from "@repo/validation/core";
import { z } from "zod";

export const userResponseSchema = z.object({
	id: zString,
	name: zString,
	email: zEmail,
});

export const createUserBodySchema = z.object({
	name: zString.meta({ example: "Tony Stark" }),
	email: zEmail.meta({ example: "tony.stark@example.com" }),
	password: zPassword.meta({ example: "abcd1234" }),
});
