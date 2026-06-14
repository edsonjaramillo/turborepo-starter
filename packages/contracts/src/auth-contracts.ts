import { JSendErrorSchema, JSendSuccessSchema } from "@repo/http/jsend";
import { HttpStatus } from "@repo/http/status-codes";
import { zString, zEmail, zPassword } from "@repo/validation/core";
import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const signInResponseSchema = z.object({ firstName: zString, lastName: zString });
export type SignInResponse = z.infer<typeof signInResponseSchema>;

export const reSignInResponseSchema = z.object({ name: zString });
export type ReSignInResponse = z.infer<typeof reSignInResponseSchema>;

export const signUpBodySchema = z.object({
	firstName: zString,
	lastName: zString,
	email: zEmail,
	password: zPassword,
});
export type SignInBody = z.infer<typeof signInBodySchema>;

export const signInBodySchema = z.object({ email: zEmail, password: zPassword });
export type SignUpBody = z.infer<typeof signUpBodySchema>;

export const emptyResponseSchema = z.object({});
export type EmptyResponse = z.infer<typeof emptyResponseSchema>;

export const authContract = c.router({
	signIn: {
		method: "POST",
		path: "/auth/sign-in",
		body: signInBodySchema,
		responses: {
			[HttpStatus.OK]: JSendSuccessSchema(signInResponseSchema),
			[HttpStatus.INTERNAL_SERVER_ERROR]: JSendErrorSchema(),
			[HttpStatus.UNAUTHORIZED]: JSendErrorSchema(),
		},
	},
	reSignIn: {
		method: "GET",
		path: "/auth/re-sign-in",
		responses: {
			[HttpStatus.OK]: JSendSuccessSchema(reSignInResponseSchema),
			[HttpStatus.UNAUTHORIZED]: JSendErrorSchema(),
		},
	},
	signOut: {
		method: "GET",
		path: "/auth/sign-out",
		responses: { [HttpStatus.OK]: JSendSuccessSchema(emptyResponseSchema) },
	},
	signUp: {
		method: "POST",
		path: "/auth/sign-up",
		body: signUpBodySchema,
		responses: {
			[HttpStatus.CREATED]: JSendSuccessSchema(emptyResponseSchema),
			[HttpStatus.BAD_REQUEST]: JSendErrorSchema(),
			[HttpStatus.CONFLICT]: JSendErrorSchema(),
		},
	},
});
