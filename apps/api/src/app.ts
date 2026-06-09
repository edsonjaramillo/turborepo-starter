import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import { apiContract } from "@repo/contracts/api-contracts";
import { JSend } from "@repo/http/jsend";
import { HttpStatus } from "@repo/http/status-codes";
import { initServer, RequestValidationError } from "@ts-rest/fastify";
import Fastify from "fastify";

import { authRouter } from "./routes/auth-routes";
import { userRouter } from "./routes/users-routes";

export const app = Fastify();

await app.register(cors, {
	origin: ["http://localhost:3000"],
	credentials: true,
});
await app.register(cookie);

const server = initServer();
const router = server.router(apiContract, {
	auth: authRouter,
	users: userRouter,
});

await app.register(server.plugin(router), {
	logInitialization: false,
	responseValidation: true,
	requestValidationErrorHandler: (_error, _request, reply) => {
		reply
			.status(HttpStatus.UNPROCESSABLE_ENTITY)
			.send(JSend.error("Validation failed for the request."));
	},
});

app.setNotFoundHandler((_request, reply) => {
	reply.status(HttpStatus.NOT_FOUND).send(JSend.error("The requested resource was not found."));
});

app.setErrorHandler((error, _request, reply) => {
	console.error("Error occurred during request processing:", error);

	if (error instanceof RequestValidationError) {
		reply
			.status(HttpStatus.UNPROCESSABLE_ENTITY)
			.send(JSend.error("Validation failed for the request."));
		return;
	}

	const statusCode = getErrorStatusCode(error);
	if (typeof statusCode === "number") {
		switch (statusCode) {
			case HttpStatus.BAD_REQUEST:
				reply
					.status(HttpStatus.BAD_REQUEST)
					.send(JSend.error("Failed to parse the request body. Please ensure it is valid JSON."));
				return;
			case HttpStatus.UNSUPPORTED_MEDIA_TYPE:
				reply
					.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
					.send(JSend.error("Invalid file type uploaded."));
				return;
			default:
				break;
		}
	}

	reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send(JSend.error("An unexpected error occurred."));
});

function getErrorStatusCode(error: unknown): number | undefined {
	if (!error || typeof error !== "object" || !("statusCode" in error)) {
		return undefined;
	}

	const { statusCode } = error;
	return typeof statusCode === "number" ? statusCode : undefined;
}
