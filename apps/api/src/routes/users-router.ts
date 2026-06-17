import { usersContract } from "@repo/contracts/users-contracts";
import { JSend } from "@repo/http/jsend";
import { HttpStatus } from "@repo/http/status-codes";
import type { RouterImplementation } from "@ts-rest/fastify";

import { database } from "../api-db";
import { authorized } from "../middleware/authorize";
import { parsePagination } from "../middleware/paginate";

export const userRouter = {
	list: async ({ query, request }) => {
		const { unauthorized, forbidden } = await authorized(request, ["users:read"]);
		if (unauthorized) {
			return { status: HttpStatus.UNAUTHORIZED, body: JSend.error("Unauthorized") };
		}

		if (forbidden) {
			return { status: HttpStatus.FORBIDDEN, body: JSend.error("Forbidden") };
		}

		const { pagination } = parsePagination(query);
		const users = await database.users.list(pagination);

		return { status: HttpStatus.OK, body: JSend.success(users, "Got users") };
	},
} satisfies RouterImplementation<typeof usersContract>;
