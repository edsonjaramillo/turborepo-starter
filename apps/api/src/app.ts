import { cors } from "@elysia/cors";
import { openapi } from "@elysia/openapi";
import { JSend } from "@repo/http/jsend";
import { HttpStatus } from "@repo/http/status-codes";
import { Elysia } from "elysia";
import { BunAdapter } from "elysia/adapter/bun";
import { z } from "zod";

import packageJson from "../package.json";
import { authRouter } from "./routes/auth/routes";
import { userRouter } from "./routes/users/routes";

export const app = new Elysia({ adapter: BunAdapter })
	.use(
		openapi({
			mapJsonSchema: { zod: z.toJSONSchema },
			documentation: {
				info: {
					title: "Turborepo Monorepo API",
					description: "API documentation for the Turborepo project",
					version: packageJson.version,
				},
			},
		}),
	)
	.use(
		cors({
			origin: ["https://web.localhost", "http://localhost:3000"],
			credentials: true,
		}),
	)
	.onError((ctx) => {
		switch (ctx.code) {
			case "INTERNAL_SERVER_ERROR":
				ctx.set.status = HttpStatus.INTERNAL_SERVER_ERROR;
				return JSend.error("An internal server error occurred.");
			case "VALIDATION":
				ctx.set.status = HttpStatus.UNPROCESSABLE_ENTITY;
				return JSend.error("Validation failed for the request.");
			case "NOT_FOUND":
				ctx.set.status = HttpStatus.NOT_FOUND;
				return JSend.error("The requested resource was not found.");
			case "INVALID_FILE_TYPE":
				ctx.set.status = HttpStatus.UNSUPPORTED_MEDIA_TYPE;
				return JSend.error("Invalid file type uploaded.");
			case "INVALID_COOKIE_SIGNATURE":
				ctx.set.status = HttpStatus.UNAUTHORIZED;
				return JSend.error("Invalid cookie signature. Please log in again.");
			case "PARSE":
				ctx.set.status = HttpStatus.BAD_REQUEST;
				return JSend.error("Failed to parse the request body. Please ensure it is valid JSON.");
			default:
				ctx.set.status = HttpStatus.INTERNAL_SERVER_ERROR;
				return JSend.error("An unexpected error occurred.");
		}
	})
	.use(userRouter)
	.use(authRouter);
