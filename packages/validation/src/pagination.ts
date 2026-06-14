import { z } from "zod";

import { zCoerceNumber } from "./core";

export const paginationSchema = z.object({
	limit: zCoerceNumber
		.meta({ description: "Limit the number of items returned. Must be positive non-zero integer." })
		.optional(),
	page: zCoerceNumber
		.meta({ description: "The page number to return. Must be positive non-zero integer." })
		.optional(),
});

export type PaginationSchema = z.infer<typeof paginationSchema>;
