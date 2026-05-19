import { apiEnv } from "../api-env";

const isProduction = apiEnv.NODE_ENV === "production";

export function createCookie(httpOnly: boolean, expires: Date) {
	return {
		domain: isProduction ? ".example.com" : "localhost",
		httpOnly,
		expires,
		path: "/",
		secure: isProduction,
		sameSite: "strict",
	} as const;
}
