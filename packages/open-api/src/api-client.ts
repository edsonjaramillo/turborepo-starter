import type { JSendError, JSendSuccess } from "@repo/http/jsend";
import createClient from "openapi-fetch";

import type { paths } from "./api-open-api-schema";
import { APIClientError } from "./errors";
import { AuthAPI } from "./resources/auth";
import { UsersAPI } from "./resources/users";

type RequestResult<T> = {
	data?: JSendSuccess<T> | JSendError;
	error?: unknown;
	response: Response;
};

export class APIClient {
	readonly raw;
	readonly users;
	readonly auth;

	constructor(public baseUrl: string) {
		this.raw = createClient<paths>({ baseUrl });
		this.users = new UsersAPI(this);
		this.auth = new AuthAPI(this);
	}

	async request<T>(request: Promise<RequestResult<T>>): Promise<T> {
		const { data, error, response } = await request;

		if (error) {
			throw new APIClientError(response.statusText || "API request failed", response.status);
		}

		if (!data) {
			throw new APIClientError("API response was empty", response.status);
		}

		if (data.status === "error") {
			throw new APIClientError(data.message, response.status);
		}

		return data.payload;
	}
}
