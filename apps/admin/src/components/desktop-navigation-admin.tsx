import { Avatar } from "@repo/ui/avatar";

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
	return (
		<div className="bg-primary">
			<div className="mx-auto flex h-navigation w-responsive items-center justify-between border">
				<span>Logo</span>
				<div className="flex gap-8">
					{links.map((link) => (
						<a key={link.name} href={link.href} className="text-white">
							{link.name}
						</a>
					))}
				</div>
				<Avatar />
			</div>
		</div>
	);
}
