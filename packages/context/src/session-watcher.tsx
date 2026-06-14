import type { APIClient } from "@repo/contracts/api-contracts";
import { useEffect } from "react";

import type { SessionStore } from "./session";

interface SessionWatcherProps {
	sessionStore: SessionStore;
	apiClient: APIClient;
}

export function SessionWatcher({ sessionStore, apiClient }: SessionWatcherProps) {
	useEffect(() => {
		void apiClient.auth.reSignIn().then((res) => {
			if (res.status === 200) {
				sessionStore.setSession(res.body.payload);
			}
			return null;
		});
	}, []);
	return null;
}
