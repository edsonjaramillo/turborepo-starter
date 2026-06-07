import type { APIClient } from "@repo/open-api/api-client";
import { APIClientError } from "@repo/open-api/errors";
import { queryOptions } from "@tanstack/react-query";

export type AuthSession = Awaited<ReturnType<APIClient["auth"]["reSignIn"]>>;

export const authSessionQueryKey = ["auth", "session"] as const;

export function authSessionQueryOptions(apiClient: APIClient) {
	return queryOptions({
		queryKey: authSessionQueryKey,
		queryFn: () => getAuthSession(apiClient),
		retry: false,
		staleTime: Infinity,
		refetchOnWindowFocus: false,
	});
}

async function getAuthSession(apiClient: APIClient): Promise<AuthSession | null> {
	try {
		return await apiClient.auth.reSignIn();
	} catch (error) {
		if (error instanceof APIClientError && error.status === 401) {
			return null;
		}

		throw error;
	}
}
