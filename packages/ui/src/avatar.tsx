import type { APIClient } from "@repo/api-client/api-client";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useCallback, useId, useRef, useState } from "react";

import { useAuthSession, useSignOut } from "./auth-query";
import { cn } from "./lib/cn";

const avatarMenuItemClassName = cn(
	"flex w-full items-center rounded-base px-3 py-2 text-left text-sm text-black transition-colors duration-base hover:bg-muted focus-visible:ring-2 focus-visible:ring-info focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-gray",
);

export interface AvatarProps {
	isSessionPending?: boolean;
	isSigningOut?: boolean;
	menuItems: readonly AvatarMenuItem[];
	onSignOut?: (closeMenu: () => void) => void;
	signInItem?: AvatarMenuItem;
	user: AvatarUser | null | undefined;
}

export interface AuthAvatarProps {
	apiClient: APIClient;
	menuLinks: readonly AuthAvatarMenuLink[];
	signInTo?: string;
}

export interface AuthAvatarMenuLink {
	to: string;
	label: ReactNode;
}

export interface AvatarMenuItem {
	id: string;
	label: ReactNode;
	render: (props: AvatarMenuItemRenderProps) => ReactNode;
}

export interface AvatarMenuItemRenderProps {
	className: string;
	onSelect: () => void;
}

export interface AvatarUser {
	firstName: string;
	lastName: string;
}

interface AvatarTriggerProps {
	id: string;
	isOpen: boolean;
	isSessionPending: boolean;
	onClick: () => void;
	user: AvatarUser | null | undefined;
}

interface AvatarMenuProps {
	id: string;
	isAuthenticated: boolean;
	isOpen: boolean;
	isSigningOut: boolean;
	menuItems: readonly AvatarMenuItem[];
	onClose: () => void;
	onSignOut?: () => void;
	signInItem?: AvatarMenuItem;
}

export function AuthAvatar({ apiClient, menuLinks, signInTo = "/sign-in" }: AuthAvatarProps) {
	const sessionQuery = useAuthSession(apiClient);
	const signOutMutation = useSignOut(apiClient);
	const menuItems = menuLinks.map(createRouterMenuItem);
	const signInItem = createRouterMenuItem({ to: signInTo, label: "Sign In" });

	return (
		<Avatar
			isSessionPending={sessionQuery.isPending}
			isSigningOut={signOutMutation.isPending}
			menuItems={menuItems}
			onSignOut={(closeMenu) => {
				if (signOutMutation.isPending) {
					return;
				}

				signOutMutation.mutate(undefined, { onSuccess: closeMenu });
			}}
			signInItem={signInItem}
			user={sessionQuery.data}
		/>
	);
}

export function Avatar({
	isSessionPending = false,
	isSigningOut = false,
	menuItems,
	onSignOut,
	signInItem,
	user,
}: AvatarProps) {
	const menuId = useId();
	const rootRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);

	const close = useCallback(() => {
		setIsOpen(false);
	}, []);

	const toggle = useCallback(() => {
		setIsOpen((current) => !current);
	}, []);

	function handleSignOut() {
		if (!onSignOut || isSigningOut) {
			return;
		}

		onSignOut(close);
	}

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
				isSigningOut={isSigningOut}
				menuItems={menuItems}
				onClose={close}
				onSignOut={onSignOut ? handleSignOut : undefined}
				signInItem={signInItem}
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
	menuItems,
	onClose,
	onSignOut,
	signInItem,
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
				{menuItems.map((item) => (
					<MenuItem key={item.id} item={item} onSelect={onClose} />
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
				) : signInItem ? (
					<MenuItem item={signInItem} onSelect={onClose} />
				) : null}
			</nav>
		</div>
	);
}

function MenuItem({ item, onSelect }: { item: AvatarMenuItem; onSelect: () => void }) {
	return (
		<>
			{item.render({
				className: avatarMenuItemClassName,
				onSelect,
			})}
		</>
	);
}

function createRouterMenuItem({ label, to }: AuthAvatarMenuLink): AvatarMenuItem {
	return {
		id: to,
		label,
		render: ({ className, onSelect }) => (
			<Link className={className} onClick={onSelect} to={to}>
				{label}
			</Link>
		),
	};
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

function getUserInitials(user: AvatarUser) {
	const initials = `${user.firstName.trim().charAt(0)}${user.lastName.trim().charAt(0)}`;
	return initials.toUpperCase() || "?";
}

function getUserName(user: AvatarUser) {
	return `${user.firstName} ${user.lastName}`.trim();
}
