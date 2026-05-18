import { Button } from "@repo/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="p-8">
			<Button>Hiiii</Button>
		</div>
	);
}
