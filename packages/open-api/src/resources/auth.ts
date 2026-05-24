import type { SignInFormData } from "@repo/validation/forms";

import type { APIClient } from "../api-client";

export class AuthAPI {
	constructor(private api: APIClient) {}

	async signIn(credentials: SignInFormData) {
		return this.api.request(
			this.api.raw.POST("/auth/sign-in", {
				credentials: "include",
				body: credentials,
			}),
		);
	}
}
