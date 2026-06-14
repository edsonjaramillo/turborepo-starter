import { cn } from "@repo/ui/cn";
import { Skeleton } from "@repo/ui/skeleton";
import { paginationSchema } from "@repo/validation/pagination";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { Suspense, use } from "react";

import { apiClient } from "#/lib/api-client";

export const Route = createFileRoute("/users")({
	component: RouteComponent,
	validateSearch: zodValidator(paginationSchema),
	loaderDeps: ({ search: { page, limit } }) => ({ page, limit }),
	loader: ({ deps }) => ({
		usersPromise: apiClient.users.list({ query: deps }).then((res) => res.body.payload),
	}),
});

function RouteComponent() {
	const { usersPromise } = Route.useLoaderData();

	return (
		<>
			<p>Hello there</p>
			<Suspense fallback={<UsersLoading />}>
				<UsersList usersPromise={usersPromise} />
			</Suspense>
		</>
	);
}

const cardStyle = cn("flex w-80 flex-col gap-4 border p-6");

type Users = Awaited<ReturnType<typeof apiClient.users.list>>["body"]["payload"];
function UsersList({ usersPromise }: { usersPromise: Promise<Users> }) {
	const users = use(usersPromise);

	return (
		<div className="space-y-2 p-6">
			{users.map((user) => (
				<div key={user.id} className={cardStyle}>
					<span>{user.firstName}</span>
					<span>{user.lastName}</span>
				</div>
			))}
		</div>
	);
}

function UsersLoading() {
	return (
		<div className="space-y-2 p-6" aria-label="Loading users">
			{Array.from({ length: 12 }).map((_, index) => (
				<div key={index} className={cardStyle}>
					<Skeleton className="h-6 w-full" />
					<Skeleton className="h-6 w-full" />
				</div>
			))}
		</div>
	);
}
