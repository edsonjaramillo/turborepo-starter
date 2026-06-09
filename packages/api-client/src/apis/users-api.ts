import type { UserResponse } from "@repo/contracts/users-contracts";
import type { PaginationSchema } from "@repo/validation/pagination";

import type { APIClient } from "../api-client";

export class UsersAPI {
	constructor(private api: APIClient) {}

	async list(pagination: PaginationSchema): Promise<UserResponse> {
		return this.api.request<UserResponse>(this.api.listUsers(pagination));
	}
}
