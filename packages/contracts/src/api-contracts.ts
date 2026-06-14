import { initClient, initContract } from "@ts-rest/core";

import { authContract } from "./auth-contracts";
import { usersContract } from "./users-contracts";

const c = initContract();

export const apiContract = c.router({
	auth: authContract,
	users: usersContract,
});

export function createAPIClient(baseUrl: string) {
	return initClient(apiContract, {
		baseUrl,
		credentials: "include",
		throwOnUnknownStatus: true,
		validateResponse: true,
	});
}

export type APIClient = ReturnType<typeof createAPIClient>;
