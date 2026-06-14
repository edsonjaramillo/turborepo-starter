import { z } from "zod";

import { zString } from "./core";

const positiveNonZeroInteger = /^[1-9]\d*$/u;
export const nonZeroSchema = zString.regex(positiveNonZeroInteger, {
	message: "Must be a positive non-zero integer",
});

export const paginationSchema = z.object({
	limit: nonZeroSchema
		.meta({ description: "Limit the number of items returned. Must be positive non-zero integer." })
		.optional(),
	page: nonZeroSchema
		.meta({ description: "The page number to return. Must be positive non-zero integer." })
		.optional(),
});

export type PaginationSchema = z.infer<typeof paginationSchema>;
