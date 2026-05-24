import type { PaginationSchema } from "@repo/validation/pagination";

import type { APIClient } from "../api-client";

export class UsersAPI {
	constructor(private api: APIClient) {}

	async list(pagination: PaginationSchema) {
		return this.api.request(
			this.api.raw.GET("/users/", {
				params: { query: { limit: pagination.limit, page: pagination.page } },
			}),
		);
	}
}
