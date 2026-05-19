import { JSend, JSendErrorSchema, JSendSuccessSchema } from "@repo/http/jsend";
import { HttpStatus } from "@repo/http/status-codes";
import { signInFormSchema } from "@repo/validation/forms";
import { Elysia } from "elysia";

import { SessionQueries } from "../db/queries/session-queries";
import { UserQueries } from "../db/queries/user-queries";
import { sessionSignInSchema } from "../db/schema/sessions-schema";
import { createCookie } from "../utils/cookies";
import { Password } from "../utils/password";

const tags = ["Auth"];

export const authRouter = new Elysia({ prefix: "/auth" }).post(
	"/sign-in",
	async (ctx) => {
		const user = await UserQueries.getUserCredentialsByEmail(ctx.body.email);

		const strToHash = user?.password || "fdajsaflsdf";
		const hashedPassword = await Password.hash(user?.password || "fdajsaflsdf");
		const verifyPassword = await Password.verify(hashedPassword, strToHash);
		console.table({ verifyPassword, user });
		if (!user || !verifyPassword) {
			ctx.set.status = HttpStatus.UNAUTHORIZED;
			return JSend.error("Invalid email or password");
		}

		const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours
		const [session] = await SessionQueries.createSession(user.id, expiresAt);

		console.table({ user, session, expiresAt, verifyPassword });
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
				name: user.name,
			},
			"Session created successfully",
		);
	},
	{
		body: signInFormSchema,
		response: {
			[HttpStatus.OK]: JSendSuccessSchema(sessionSignInSchema),
			[HttpStatus.INTERNAL_SERVER_ERROR]: JSendErrorSchema(),
			[HttpStatus.UNAUTHORIZED]: JSendErrorSchema(),
		},
		detail: {
			tags,
			description: "Get a list of users",
		},
	},
);
