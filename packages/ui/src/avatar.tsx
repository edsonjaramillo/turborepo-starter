import type { DisclosureStore } from "@repo/context/disclosure";
import type { SessionStore } from "@repo/context/session";
import type { APIClient } from "@repo/contracts/api-contracts";
import { Link } from "@tanstack/react-router";

import { Button, buttonVariants } from "./button";
import { cn } from "./lib/cn";

interface AvatarMenuLink {
	to: string;
	label: string;
}

interface AvatarProps {
	apiClient: APIClient;
	avatarDisclosureContext: DisclosureStore;
	sessionContext: SessionStore;
	authorizedLinks: AvatarMenuLink[];
}

export function Avatar({
	apiClient,
	sessionContext,
	avatarDisclosureContext,
	authorizedLinks,
}: AvatarProps) {
	if (!sessionContext.isAuthenticated) {
		return (
			<UserCircleIcon
				apiClient={apiClient}
				sessionContext={sessionContext}
				avatarDisclosureContext={avatarDisclosureContext}
			/>
		);
	}

	const firstLetter = sessionContext.user.name.at(0) ?? "?";

	return (
		<div className="relative">
			<button
				type="button"
				className="flex size-10 items-center justify-center rounded-full bg-black text-white"
				onClick={avatarDisclosureContext.toggle}>
				<span>{firstLetter.toUpperCase()}</span>
			</button>
			<AvatarMenu
				apiClient={apiClient}
				avatarDisclosureContext={avatarDisclosureContext}
				sessionContext={sessionContext}
				authorizedLinks={authorizedLinks}
			/>
		</div>
	);
}

interface AvatarMenuProps {
	apiClient: APIClient;
	sessionContext: SessionStore;
	avatarDisclosureContext: DisclosureStore;
	authorizedLinks: AvatarMenuLink[];
}

function AvatarMenu({
	apiClient,
	avatarDisclosureContext,
	sessionContext,
	authorizedLinks,
}: AvatarMenuProps) {
	return (
		<div
			className={cn(
				"absolute top-12 right-0 border bg-white p-4 opacity-0 transition-opacity duration-base",
				avatarDisclosureContext.isOpen && "opacity-100",
			)}>
			{sessionContext.isAuthenticated && (
				<ul>
					{authorizedLinks.map((link) => (
						<li key={link.to}>
							<Link to={link.to} onClick={avatarDisclosureContext.close} className="text-white">
								{link.label}
							</Link>
						</li>
					))}
				</ul>
			)}
			<hr className="py-1" />
			{sessionContext.isAuthenticated && (
				<Button
					className={buttonVariants({ color: "danger" })}
					type="button"
					onClick={async () => {
						const { status } = await apiClient.auth.signOut();
						if (status === 200) {
							sessionContext.clearSession();
						}
						avatarDisclosureContext.close();
					}}>
					Sign Out
				</Button>
			)}
			{!sessionContext.isAuthenticated && (
				<Link
					to="/sign-in"
					className={buttonVariants({ color: "success" })}
					onClick={avatarDisclosureContext.close}>
					Sign In
				</Link>
			)}
		</div>
	);
}

interface UserCircleIconProps {
	apiClient: APIClient;
	sessionContext: SessionStore;
	avatarDisclosureContext: DisclosureStore;
}

function UserCircleIcon({
	apiClient,
	sessionContext,
	avatarDisclosureContext,
}: UserCircleIconProps) {
	const style = cn("size-10");
	return (
		<div className="relative">
			<button type="button" aria-label="User menu" onClick={avatarDisclosureContext.toggle}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					className={style}
					aria-hidden>
					<path
						fillRule="evenodd"
						d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
						clipRule="evenodd"
					/>
				</svg>
			</button>
			<AvatarMenu
				apiClient={apiClient}
				avatarDisclosureContext={avatarDisclosureContext}
				sessionContext={sessionContext}
				authorizedLinks={[]}
			/>
		</div>
	);
}
