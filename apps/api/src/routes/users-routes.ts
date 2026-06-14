import { usersContract } from "@repo/contracts/users-contracts";
import { JSend } from "@repo/http/jsend";
import { HttpStatus } from "@repo/http/status-codes";
import type { RouterImplementation } from "@ts-rest/fastify";

import { database } from "../api-db";
import { parsePagination } from "../middleware/paginate";

export const userRouter = {
	list: async ({ query }) => {
		const { pagination } = parsePagination({ query });
		const users = await database.users.list(pagination);

		return { status: HttpStatus.OK, body: JSend.success(users, "Got users") };
	},
} satisfies RouterImplementation<typeof usersContract>;
