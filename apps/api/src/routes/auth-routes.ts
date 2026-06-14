import { authContract } from "@repo/contracts/auth-contracts";
import { JSend } from "@repo/http/jsend";
import { HttpStatus } from "@repo/http/status-codes";
import { hashPassword, verifyPassword } from "@repo/security/password";
import type { RouterImplementation } from "@ts-rest/fastify";

import { database } from "../api-db";
import { apiEnv } from "../api-env";
import { createCookie } from "../utils/cookies";

const sessionDurationMs = 1000 * 60 * 60 * 24;

export const authRouter = {
	signIn: async ({ body, reply }) => {
		const user = await database.users.getSignInProfileByEmail(body.email);

		const passwordHash = user?.passwordHash ?? apiEnv.DUMMY_PASSWORD_HASH;
		const passwordMatches = await verifyPassword(passwordHash, body.password);

		if (!user || !passwordMatches) {
			return { status: HttpStatus.UNAUTHORIZED, body: JSend.error("Invalid email or password") };
		}

		const expiresAt = new Date(Date.now() + sessionDurationMs);
		const session = await database.sessions.create(user.id, expiresAt);
		if (!session) {
			return {
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				body: JSend.error("Failed to create session"),
			};
		}

		reply.setCookie("session", session.id, createCookie(true, expiresAt));

		return {
			status: HttpStatus.OK,
			body: JSend.success(
				{ firstName: user.firstName, lastName: user.lastName },
				"Session created successfully",
			),
		};
	},
	reSignIn: async ({ request, reply }) => {
		const sessionId = request.cookies.session;
		if (typeof sessionId !== "string" || !sessionId) {
			return { status: HttpStatus.UNAUTHORIZED, body: JSend.error("Session not found") };
		}

		const session = await database.sessions.getSignInProfileById(sessionId);
		if (!session || !session.user || session.expiresAt <= new Date()) {
			return { status: HttpStatus.UNAUTHORIZED, body: JSend.error("Session not found") };
		}

		const expiresAt = new Date(Date.now() + sessionDurationMs);
		await database.sessions.updateExpiresAt(sessionId, expiresAt);
		reply.setCookie("session", sessionId, createCookie(true, expiresAt));

		return {
			status: HttpStatus.OK,
			body: JSend.success({ name: session.user.firstName }, "Session found successfully"),
		};
	},
	signOut: async ({ request, reply }) => {
		const sessionId = request.cookies.session;
		if (typeof sessionId === "string" && sessionId) {
			await database.sessions.deleteById(sessionId);
		}

		reply.setCookie("session", "", createCookie(true, new Date(0)));

		return { status: HttpStatus.OK, body: JSend.success({}, "Session ended successfully") };
	},
	signUp: async ({ body }) => {
		const existingUser = await database.users.getByEmail(body.email);
		if (existingUser) {
			return { status: HttpStatus.CONFLICT, body: JSend.error("User already exists.") };
		}

		const passwordHash = await hashPassword(body.password);
		await database.users.create({ ...body, passwordHash });

		return { status: HttpStatus.CREATED, body: JSend.success({}, "User created succesfully.") };
	},
} satisfies RouterImplementation<typeof authContract>;
