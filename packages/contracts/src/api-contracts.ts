import { initContract } from "@ts-rest/core";

import { authContract } from "./auth-contracts";
import { usersContract } from "./users-contracts";

const c = initContract();

export const apiContract = c.router({
	auth: authContract,
	users: usersContract,
});
