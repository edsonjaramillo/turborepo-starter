import { JSend, JSendErrorSchema, JSendSuccessSchema } from "@repo/http/jsend";
import { HttpStatus } from "@repo/http/status-codes";
import { hashPassword } from "@repo/security/password";
import { paginationSchema } from "@repo/validation/pagination";
import { Elysia } from "elysia";
import { z } from "zod";

import { database } from "../../api-db";
import { parsePagination } from "../../middleware/paginate";
import { createUserBodySchema, userResponseSchema } from "./contracts";

const tags = ["Users"];

const paginatedUsersRouter = new Elysia().resolve(parsePagination).get(
	"/",
	async (ctx) => {
		const users = await database.users.list(ctx.pagination);
		ctx.set.status = HttpStatus.OK;
		return JSend.success(users, "Got users");
	},
	{
		query: paginationSchema,
		response: {
			[HttpStatus.OK]: JSendSuccessSchema(z.array(userResponseSchema)),
			[HttpStatus.BAD_REQUEST]: JSendErrorSchema(),
		},
		detail: {
			tags,
			description: "Get a list of users",
		},
	},
);

export const userRouter = new Elysia({ prefix: "/users" }).use(paginatedUsersRouter).post(
	"/",
	async (ctx) => {
		const existingUser = await database.users.getByEmail(ctx.body.email);
		if (existingUser) {
			ctx.set.status = HttpStatus.CONFLICT;
			return JSend.error("User already exists.");
		}

		const password = await hashPassword(ctx.body.password);
		await database.users.create({ ...ctx.body, password });

		ctx.set.status = HttpStatus.CREATED;
		return JSend.success({}, "User created succesfully.");
	},
	{
		body: createUserBodySchema,
		response: {
			[HttpStatus.CREATED]: JSendSuccessSchema(z.object({})),
			[HttpStatus.BAD_REQUEST]: JSendErrorSchema(),
			[HttpStatus.CONFLICT]: JSendErrorSchema(),
		},
		detail: {
			tags,
			description: "Create a new user",
		},
	},
);
