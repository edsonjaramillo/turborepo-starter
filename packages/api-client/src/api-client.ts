import { apiContract } from "@repo/contracts/api-contracts";
import type { SignInBody, SignUpBody } from "@repo/contracts/auth-contracts";
import type { JSendError, JSendSuccess } from "@repo/http/jsend";
import type { PaginationSchema } from "@repo/validation/pagination";
import { initClient } from "@ts-rest/core";

import { AuthAPI } from "./apis/auth-api";
import { UsersAPI } from "./apis/users-api";
import { APIClientError } from "./errors";

type RequestResult = Promise<{
	body: unknown;
	status: number;
}>;

export class APIClient {
	private readonly raw;
	readonly users;
	readonly auth;

	constructor(public baseUrl: string) {
		this.raw = initClient(apiContract, {
			baseUrl,
			baseHeaders: {},
			credentials: "include",
			throwOnUnknownStatus: true,
			validateResponse: true,
		});
		this.users = new UsersAPI(this);
		this.auth = new AuthAPI(this);
	}

	async request<T>(request: RequestResult): Promise<T> {
		const { body, status } = await request;

		if (!isJSendResponse<T>(body)) {
			throw new APIClientError("API response was invalid", status);
		}

		if (body.status === "error") {
			throw new APIClientError(body.message, status);
		}

		return body.payload;
	}

	signIn(credentials: SignInBody) {
		return this.raw.auth.signIn({ body: credentials });
	}

	signUp(credentials: SignUpBody) {
		return this.raw.auth.signUp({ body: credentials });
	}

	reSignIn() {
		return this.raw.auth.reSignIn();
	}

	signOut() {
		return this.raw.auth.signOut();
	}

	listUsers(pagination: PaginationSchema) {
		return this.raw.users.list({
			query: { limit: pagination.limit, page: pagination.page },
		});
	}
}

function isJSendResponse<T>(body: unknown): body is JSendSuccess<T> | JSendError {
	if (body === null || typeof body !== "object" || !("status" in body)) {
		return false;
	}

	const status = body.status;
	return status === "success" || status === "error";
}
