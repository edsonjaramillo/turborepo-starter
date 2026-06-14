import { paginationSchema } from "@repo/validation/pagination";

export interface Pagination {
	page: number;
	limit: number;
	offset: number;
}

const DEFAULT_LIMIT = 25;
const DEFAULT_PAGE = 1;

type ParsePaginationInput = { query: { limit?: number; page?: number } };
type ParsePaginationOutput = { pagination: Pagination };

export function parsePagination({ query }: ParsePaginationInput): ParsePaginationOutput {
	const parsedQuery = paginationSchema.parse(query);
	const page = parsedQuery.page ?? DEFAULT_PAGE;
	const limit = parsedQuery.limit ?? DEFAULT_LIMIT;

	return { pagination: { page, limit, offset: (page - 1) * limit } };
}
