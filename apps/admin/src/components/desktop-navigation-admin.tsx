import { Avatar } from "@repo/ui/avatar";
import { Link } from "@tanstack/react-router";

import { useAvatarDisclosure, useSession } from "#/context/admin-context";
import { apiClient } from "#/lib/admin-api-client";

const links = [
	{
		name: "Home",
		href: "/",
	},
	{
		name: "Sign-In",
		href: "/sign-in",
	},
	{
		name: "Sign-Up",
		href: "/sign-up",
	},
	{
		name: "Users",
		href: "/users",
	},
];

export function DesktopNavigation() {
	const avatarDisclosure = useAvatarDisclosure();
	const session = useSession();

	return (
		<div className="bg-primary">
			<div className="mx-auto flex h-navigation w-responsive items-center justify-between">
				<span>Logo</span>
				<div className="flex gap-8">
					{links.map((link) => (
						<Link key={link.name} to={link.href} className="text-white">
							{link.name}
						</Link>
					))}
				</div>
				<Avatar
					apiClient={apiClient}
					disclosure={avatarDisclosure}
					menuLinks={links.map((link) => ({ to: link.href, label: link.name }))}
					session={session}
				/>
			</div>
		</div>
	);
}
