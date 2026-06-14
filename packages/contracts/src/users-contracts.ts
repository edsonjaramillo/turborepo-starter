import { JSendSuccessSchema } from "@repo/http/jsend";
import { HttpStatus } from "@repo/http/status-codes";
import { zString } from "@repo/validation/core";
import { paginationSchema } from "@repo/validation/pagination";
import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const userResponseSchema = z.array(
	z.object({ id: zString, firstName: zString, lastName: zString }),
);
export type UserResponse = z.infer<typeof userResponseSchema>;

export const usersContract = c.router(
	{
		list: {
			method: "GET",
			path: "/users/",
			query: paginationSchema,
			responses: { [HttpStatus.OK]: JSendSuccessSchema(userResponseSchema) },
		},
	},
	{ strictStatusCodes: true },
);
