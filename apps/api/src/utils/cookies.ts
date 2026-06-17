import type { FastifyRequest } from "fastify";

import { apiEnv } from "../api-env";

const isProduction = apiEnv.NODE_ENV === "production";

export function createCookie(httpOnly: boolean, expires: Date) {
	return {
		...(isProduction ? { domain: ".example.com" } : {}),
		httpOnly,
		expires,
		path: "/",
		secure: isProduction,
		sameSite: "strict",
	} as const;
}

export function getCookie(request: FastifyRequest, name: string): string | null {
	const cookie = request.cookies[name];

	if (typeof cookie !== "string" || cookie === "") {
		return null;
	}

	return cookie;
}
