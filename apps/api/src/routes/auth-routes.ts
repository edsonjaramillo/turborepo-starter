import { signInSessionResponseSchema } from "@repo/contracts/auth";
import { JSend, JSendErrorSchema, JSendSuccessSchema } from "@repo/http/jsend";
import { HttpStatus } from "@repo/http/status-codes";
import { verifyPassword } from "@repo/security/password";
import { signInFormSchema } from "@repo/validation/forms";
import { Elysia } from "elysia";

import { database } from "../api-db";
import { apiEnv } from "../api-env";
import { createCookie } from "../utils/cookies";

const tags = ["Auth"];

export const authRouter = new Elysia({ prefix: "/auth" }).post(
	"/sign-in",
	async (ctx) => {
		const user = await database.users.getCredentialsByEmail(ctx.body.email);

		const passwordHash = user?.password ?? apiEnv.DUMMY_PASSWORD_HASH;
		const passwordMatches = await verifyPassword(passwordHash, ctx.body.password);

		if (!user || !passwordMatches) {
			ctx.set.status = HttpStatus.UNAUTHORIZED;
			return JSend.error("Invalid email or password");
		}

		const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
		const [session] = await database.sessions.create(user.id, expiresAt);

		if (!session) {
			ctx.set.status = HttpStatus.INTERNAL_SERVER_ERROR;
			return JSend.error("Failed to create session");
		}

		const cookieOptions = createCookie(true, expiresAt);
		ctx.cookie.session?.set({ ...cookieOptions, value: session.id });

		ctx.set.status = HttpStatus.OK;
		return JSend.success(
			{
				id: session.id,
				firstName: user.firstName,
				lastName: user.lastName,
			},
			"Session created successfully",
		);
	},
	{
		body: signInFormSchema,
		response: {
			[HttpStatus.OK]: JSendSuccessSchema(signInSessionResponseSchema),
			[HttpStatus.INTERNAL_SERVER_ERROR]: JSendErrorSchema(),
			[HttpStatus.UNAUTHORIZED]: JSendErrorSchema(),
		},
		detail: {
			tags,
			description: "Sign in a user and create a session",
		},
	},
);
