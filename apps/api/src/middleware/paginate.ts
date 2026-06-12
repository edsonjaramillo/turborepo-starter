import { paginationSchema } from "@repo/validation/pagination";

export interface Pagination {
	page: number;
	limit: number;
	offset: number;
}

const DEFAULT_LIMIT = 25;
const DEFAULT_PAGE = 1;

export function parsePagination({ query }: { query: unknown }): { pagination: Pagination } {
	const parsedQuery = paginationSchema.parse(query);
	const page =
		parsedQuery.page === undefined ? DEFAULT_PAGE : Number.parseInt(parsedQuery.page, 10);
	const limit =
		parsedQuery.limit === undefined ? DEFAULT_LIMIT : Number.parseInt(parsedQuery.limit, 10);

	return { pagination: { page, limit, offset: (page - 1) * limit } };
}
