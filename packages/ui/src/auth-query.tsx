import type { APIClient } from "@repo/api-client/api-client";
import { APIClientError } from "@repo/api-client/errors";
import {
	type QueryClient,
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";

export type AuthSession = Awaited<ReturnType<APIClient["auth"]["reSignIn"]>>;

export const authSessionQueryKey = ["auth", "session"] as const;
const authSessionStaleTimeMs = 1000 * 60;
const authSessionRefreshIntervalMs = 1000 * 60 * 15;

export function authSessionQueryOptions(apiClient: APIClient) {
	return queryOptions({
		queryKey: authSessionQueryKey,
		queryFn: () => getAuthSession(apiClient),
		retry: (failureCount, error) => !isUnauthorizedError(error) && failureCount < 2,
		staleTime: (query) => (query.state.data ? authSessionStaleTimeMs : 0),
		refetchInterval: (query) => (query.state.data ? authSessionRefreshIntervalMs : false),
		refetchOnMount: "always",
		refetchOnWindowFocus: true,
		refetchOnReconnect: true,
	});
}

export function useAuthSession(apiClient: APIClient) {
	return useQuery(authSessionQueryOptions(apiClient));
}

export function useSignOut(apiClient: APIClient) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => apiClient.auth.signOut(),
		onSuccess: () => {
			clearAuthSession(queryClient);
		},
	});
}

export function setAuthSession(queryClient: QueryClient, session: AuthSession | null) {
	queryClient.setQueryData(authSessionQueryKey, session);
}

export function clearAuthSession(queryClient: QueryClient) {
	setAuthSession(queryClient, null);
}

export function refreshAuthSession(queryClient: QueryClient, apiClient: APIClient) {
	return queryClient.fetchQuery(authSessionQueryOptions(apiClient));
}

async function getAuthSession(apiClient: APIClient): Promise<AuthSession | null> {
	try {
		return await apiClient.auth.reSignIn();
	} catch (error) {
		if (isUnauthorizedError(error)) {
			return null;
		}

		throw error;
	}
}

function isUnauthorizedError(error: unknown) {
	return error instanceof APIClientError && error.status === 401;
}
