import { paginationSchema } from "@repo/validation/pagination";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

import { apiClient } from "#/lib/api-client";

export const Route = createFileRoute("/users")({
	component: RouteComponent,
	validateSearch: zodValidator(paginationSchema),
	loaderDeps: ({ search: { page, limit } }) => ({ page, limit }),
	loader: async ({ deps }) => {
		const { body } = await apiClient.users.list({ query: deps });
		return body.payload;
	},
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
