import { paginationSchema } from "@repo/validation/pagination";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

import { apiClient } from "#/lib/admin-api-client";

export const Route = createFileRoute("/users")({
	component: RouteComponent,
	validateSearch: zodValidator(paginationSchema),
	loaderDeps: ({ search: { page, limit } }) => ({ page, limit }),
	loader: async ({ deps: { page, limit } }) => {
		return apiClient.users.list({ limit, page });
	},
	errorComponent: function () {
		return <p>Failed to load users.</p>;
	},
	onError: () => redirect({ to: "/" }),
});

function RouteComponent() {
	const users = Route.useLoaderData();
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
