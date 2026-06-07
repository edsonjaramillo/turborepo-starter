import type { SignInBody, SignUpBody } from "@repo/contracts/auth-contracts";

import type { APIClient } from "../api-client";

export class AuthAPI {
	constructor(private api: APIClient) {}

	async signIn(credentials: SignInBody) {
		return this.api.request(
			this.api.raw.POST("/auth/sign-in", {
				credentials: "include",
				body: credentials,
			}),
		);
	}

	async signUp(credentials: SignUpBody) {
		return this.api.request(
			this.api.raw.POST("/auth/sign-up", {
				body: credentials,
			}),
		);
	}

	async reSignIn() {
		return this.api.request(
			this.api.raw.GET("/auth/re-sign-in", {
				credentials: "include",
			}),
		);
	}
}
