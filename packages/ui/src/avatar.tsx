import type { DisclosureStore } from "@repo/context/disclosure";
import type { SessionStore } from "@repo/context/session";
import type { APIClient } from "@repo/open-api/api-client";
import { useEffect } from "react";

type SignedInUser = Awaited<ReturnType<APIClient["auth"]["reSignIn"]>>;

const autoSignInRequests = new WeakMap<APIClient, Promise<SignedInUser | null>>();

function autoSignIn(apiClient: APIClient) {
	const cachedRequest = autoSignInRequests.get(apiClient);
	if (cachedRequest) {
		return cachedRequest;
	}

	const request = apiClient.auth.reSignIn().catch(() => null);
	autoSignInRequests.set(apiClient, request);

	return request;
}

interface AvatarProps {
	apiClient: APIClient;
	disclosure: DisclosureStore;
	session: SessionStore;
}

export function Avatar({ apiClient, disclosure, session }: AvatarProps) {
	const { user, setSession, clearSession } = session;

	useEffect(() => {
		let isCurrent = true;

		autoSignIn(apiClient).then((nextUser) => {
			if (isCurrent) {
				if (nextUser) {
					setSession(nextUser);
				} else {
					clearSession();
				}
			}
		});

		return () => {
			isCurrent = false;
		};
	}, [apiClient, setSession, clearSession]);

	if (user === undefined) {
		return <BlankUser />;
	}

	const initials = user
		? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
		: String(disclosure.isOpen);
	const ariaLabel = user ? `${user.firstName} ${user.lastName}` : "Open account menu";

	return (
		<button
			type="button"
			aria-label={ariaLabel}
			className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-black"
			onClick={disclosure.toggle}
		>
			<span className="text-white">{initials}</span>
		</button>
	);
}

function BlankUser() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			className="size-10"
		>
			<path
				fillRule="evenodd"
				d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
				clipRule="evenodd"
			/>
		</svg>
	);
}
