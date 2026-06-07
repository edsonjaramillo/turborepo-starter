import { paginationSchema, type PaginationSchema } from "@repo/validation/pagination";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

import { apiClient } from "#/lib/admin-api-client";

function usersQueryOptions(pagination: PaginationSchema) {
	return queryOptions({
		queryKey: ["users", pagination],
		queryFn: () => apiClient.users.list(pagination),
	});
}

export const Route = createFileRoute("/users")({
	component: RouteComponent,
	validateSearch: zodValidator(paginationSchema),
	loaderDeps: ({ search: { page, limit } }) => ({ page, limit }),
	loader: ({ context, deps }) => {
		return context.queryClient.ensureQueryData(usersQueryOptions(deps));
	},
});

function RouteComponent() {
	const pagination = Route.useLoaderDeps();
	const { data: users } = useSuspenseQuery(usersQueryOptions(pagination));

	return (
		<div>
			{users.map((user) => (
				<div key={user.id}>
					{user.firstName} {user.lastName}
				</div>
			))}
		</div>
	);
}
