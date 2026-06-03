import { userResponseSchema } from "@repo/contracts/users-contracts";
import { JSend, JSendSuccessSchema } from "@repo/http/jsend";
import { HttpStatus } from "@repo/http/status-codes";
import { paginationSchema } from "@repo/validation/pagination";
import { Elysia } from "elysia";

import { database } from "../api-db";
import { parsePagination } from "../middleware/paginate";

const tags = ["Users"];

export const userRouter = new Elysia().resolve(parsePagination).get(
	"/",
	async (ctx) => {
		const users = await database.users.list(ctx.pagination);
		ctx.set.status = HttpStatus.OK;
		return JSend.success(users, "Got users");
	},
	{
		query: paginationSchema,
		response: {
			[HttpStatus.OK]: JSendSuccessSchema(userResponseSchema),
		},
		detail: {
			tags,
			description: "Get a list of users",
		},
	},
);
