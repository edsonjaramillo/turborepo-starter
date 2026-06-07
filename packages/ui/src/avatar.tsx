import type { APIClient } from "@repo/open-api/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { authSessionQueryKey, authSessionQueryOptions, type AuthSession } from "./auth-query";
import { cn } from "./lib/cn";

const avatarMenuItemClassName = cn(
	"flex w-full items-center rounded-base px-3 py-2 text-left text-sm text-black transition-colors duration-base hover:bg-muted focus-visible:ring-2 focus-visible:ring-info focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-gray",
);

export interface AvatarProps {
	apiClient: APIClient;
	menuLinks: readonly AvatarMenuLink[];
	signInTo?: string;
}

export interface AvatarMenuLink {
	to: string;
	label: ReactNode;
}

interface AvatarTriggerProps {
	id: string;
	isOpen: boolean;
	isSessionPending: boolean;
	onClick: () => void;
	user: AuthSession | null | undefined;
}

interface AvatarMenuProps {
	id: string;
	isAuthenticated: boolean;
	isOpen: boolean;
	isSigningOut: boolean;
	menuLinks: readonly AvatarMenuLink[];
	onClose: () => void;
	onSignOut: () => void;
	signInTo: string;
}

export function Avatar({ apiClient, menuLinks, signInTo = "/sign-in" }: AvatarProps) {
	const menuId = useId();
	const rootRef = useRef<HTMLDivElement>(null);
	const queryClient = useQueryClient();
	const [isOpen, setIsOpen] = useState(false);

	const sessionQuery = useQuery(authSessionQueryOptions(apiClient));
	const close = useCallback(() => {
		setIsOpen(false);
	}, []);
	const signOutMutation = useMutation({
		mutationFn: () => apiClient.auth.signOut(),
		onSuccess: () => {
			queryClient.setQueryData(authSessionQueryKey, null);
			close();
		},
	});

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		function handlePointerDown(event: PointerEvent) {
			const target = event.target;
			if (!(target instanceof Node) || rootRef.current?.contains(target)) {
				return;
			}

			close();
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				close();
			}
		}

		document.addEventListener("pointerdown", handlePointerDown);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [close, isOpen]);

	const toggle = useCallback(() => {
		setIsOpen((current) => !current);
	}, []);

	function handleSignOut() {
		if (signOutMutation.isPending) {
			return;
		}

		signOutMutation.mutate();
	}

	const user = sessionQuery.data;
	const isSessionPending = sessionQuery.isPending;

	return (
		<div ref={rootRef} className="relative flex flex-col items-end">
			<AvatarTrigger
				id={menuId}
				isOpen={isOpen}
				isSessionPending={isSessionPending}
				onClick={toggle}
				user={user}
			/>
			<AvatarMenu
				id={menuId}
				isAuthenticated={Boolean(user)}
				isOpen={isOpen}
				isSigningOut={signOutMutation.isPending}
				menuLinks={menuLinks}
				onClose={close}
				onSignOut={handleSignOut}
				signInTo={signInTo}
			/>
		</div>
	);
}

function AvatarTrigger({ id, isOpen, isSessionPending, onClick, user }: AvatarTriggerProps) {
	const userName = user ? getUserName(user) : undefined;
	const ariaLabel = userName ? `Open account menu for ${userName}` : "Open account menu";

	return (
		<button
			type="button"
			aria-label={ariaLabel}
			aria-busy={isSessionPending || undefined}
			aria-controls={id}
			aria-expanded={isOpen}
			aria-haspopup="true"
			className={cn(
				"flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-base focus-visible:ring-2 focus-visible:ring-info focus-visible:ring-offset-2 focus-visible:outline-none",
				user ? "bg-black text-white" : "bg-white text-black",
			)}
			onClick={onClick}
		>
			{user ? (
				<span className="text-sm font-medium">{getUserInitials(user)}</span>
			) : (
				<UserCircleIcon className="size-10" />
			)}
		</button>
	);
}

function AvatarMenu({
	id,
	isAuthenticated,
	isOpen,
	isSigningOut,
	menuLinks,
	onClose,
	onSignOut,
	signInTo,
}: AvatarMenuProps) {
	return (
		<div
			id={id}
			hidden={!isOpen}
			className={cn(
				"absolute top-full right-0 left-auto z-modal mt-2 min-w-44 origin-top-right rounded-base border border-muted bg-white p-1 shadow-base",
				isOpen && "motion-safe:animate-avatar-popup motion-reduce:animate-none",
			)}
		>
			<nav aria-label="Account menu" className="flex flex-col gap-1">
				{menuLinks.map((link) => (
					<Link key={link.to} className={avatarMenuItemClassName} onClick={onClose} to={link.to}>
						{link.label}
					</Link>
				))}
				{isAuthenticated ? (
					<button
						className={avatarMenuItemClassName}
						disabled={isSigningOut}
						type="button"
						onClick={onSignOut}
					>
						{isSigningOut ? "Signing out..." : "Sign Out"}
					</button>
				) : (
					<Link className={avatarMenuItemClassName} onClick={onClose} to={signInTo}>
						Sign In
					</Link>
				)}
			</nav>
		</div>
	);
}

function UserCircleIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			className={className}
			aria-hidden
		>
			<path
				fillRule="evenodd"
				d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
				clipRule="evenodd"
			/>
		</svg>
	);
}

function getUserInitials(user: AuthSession) {
	const initials = `${user.firstName.trim().charAt(0)}${user.lastName.trim().charAt(0)}`;
	return initials.toUpperCase() || "?";
}

function getUserName(user: AuthSession) {
	return `${user.firstName} ${user.lastName}`.trim();
}
