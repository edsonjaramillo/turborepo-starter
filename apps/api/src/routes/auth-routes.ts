import {
	signInFormSchema,
	signInResponseSchema,
	signUpBodySchema,
} from "@repo/contracts/auth-contracts";
import { JSend, JSendErrorSchema, JSendSuccessSchema } from "@repo/http/jsend";
import { HttpStatus } from "@repo/http/status-codes";
import { hashPassword, verifyPassword } from "@repo/security/password";
import { Elysia } from "elysia";
import { z } from "zod";

import { database } from "../api-db";
import { apiEnv } from "../api-env";
import { createCookie } from "../utils/cookies";

const tags = ["Auth"];

export const authRouter = new Elysia({ prefix: "/auth" })
	.post(
		"/sign-in",
		async (ctx) => {
			const user = await database.users.getSignInProfileByEmail(ctx.body.email);

			const passwordHash = user?.password ?? apiEnv.DUMMY_PASSWORD_HASH;
			const passwordMatches = await verifyPassword(passwordHash, ctx.body.password);

			if (!user || !passwordMatches) {
				ctx.set.status = HttpStatus.UNAUTHORIZED;
				return JSend.error("Invalid email or password");
			}

			const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
			const session = await database.sessions.create(user.id, expiresAt);
			if (!session) {
				ctx.set.status = HttpStatus.INTERNAL_SERVER_ERROR;
				return JSend.error("Failed to create session");
			}

			const cookieOptions = createCookie(true, expiresAt);
			ctx.cookie.session?.set({ ...cookieOptions, value: session.id });

			ctx.set.status = HttpStatus.OK;
			return JSend.success(
				{
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					permissions: user.permissions,
				},
				"Session created successfully",
			);
		},
		{
			body: signInFormSchema,
			response: {
				[HttpStatus.OK]: JSendSuccessSchema(signInResponseSchema),
				[HttpStatus.INTERNAL_SERVER_ERROR]: JSendErrorSchema(),
				[HttpStatus.UNAUTHORIZED]: JSendErrorSchema(),
			},
			detail: {
				tags,
				description: "Sign in a user and create a session",
			},
		},
	)
	.post(
		"/sign-up",
		async (ctx) => {
			const existingUser = await database.users.getByEmail(ctx.body.email);
			if (existingUser) {
				ctx.set.status = HttpStatus.CONFLICT;
				return JSend.error("User already exists.");
			}

			const password = await hashPassword(ctx.body.password);
			await database.users.create({ ...ctx.body, password });

			ctx.set.status = HttpStatus.CREATED;
			return JSend.success({}, "User created succesfully.");
		},
		{
			body: signUpBodySchema,
			response: {
				[HttpStatus.CREATED]: JSendSuccessSchema(z.object({})),
				[HttpStatus.BAD_REQUEST]: JSendErrorSchema(),
				[HttpStatus.CONFLICT]: JSendErrorSchema(),
			},
			detail: {
				tags,
				description: "Create a new user",
			},
		},
	);
