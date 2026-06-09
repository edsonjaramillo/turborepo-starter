import type {
	EmptyResponse,
	ReSignInResponse,
	SignInBody,
	SignInResponse,
	SignUpBody,
} from "@repo/contracts/auth-contracts";

import type { APIClient } from "../api-client";

export class AuthAPI {
	constructor(private api: APIClient) {}

	async signIn(credentials: SignInBody): Promise<SignInResponse> {
		return this.api.request<SignInResponse>(this.api.signIn(credentials));
	}

	async signUp(credentials: SignUpBody): Promise<EmptyResponse> {
		return this.api.request<EmptyResponse>(this.api.signUp(credentials));
	}

	async reSignIn(): Promise<ReSignInResponse> {
		return this.api.request<ReSignInResponse>(this.api.reSignIn());
	}

	async signOut(): Promise<EmptyResponse> {
		return this.api.request<EmptyResponse>(this.api.signOut());
	}
}
