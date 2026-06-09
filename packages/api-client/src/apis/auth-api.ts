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

	signIn(credentials: SignInBody): Promise<SignInResponse> {
		return this.api.request<SignInResponse>(this.api.signIn(credentials));
	}

	signUp(credentials: SignUpBody): Promise<EmptyResponse> {
		return this.api.request<EmptyResponse>(this.api.signUp(credentials));
	}

	reSignIn(): Promise<ReSignInResponse> {
		return this.api.request<ReSignInResponse>(this.api.reSignIn());
	}

	signOut(): Promise<EmptyResponse> {
		return this.api.request<EmptyResponse>(this.api.signOut());
	}
}
