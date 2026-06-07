import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { signInBodySchema, type SignInBody } from "@repo/contracts/auth-contracts";
import { Button } from "@repo/ui/button";
import { Form } from "@repo/ui/form";
import { Input, InputError, InputGroup, Label } from "@repo/ui/inputs";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";

import { useSession } from "#/context/admin-context";
import { apiClient } from "#/lib/admin-api-client";

export const Route = createFileRoute("/sign-in")({
	beforeLoad: () => {
		if (useSession.getState().isAuthenticated) {
			throw redirect({ to: "/" });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const form = useForm<SignInBody>({
		resolver: standardSchemaResolver(signInBodySchema),
		defaultValues: {
			email: "edson.jaramillo@example.com",
			password: "abcd1234",
		},
	});

	const { setSession } = useSession();

	const onSubmit = form.handleSubmit(async (data) => {
		const session = await apiClient.auth.signIn(data);
		setSession(session);
	});

	return (
		<div>
			<FormProvider {...form}>
				<Form className="mx-auto space-y-5 p-6" onSubmit={onSubmit}>
					<InputGroup>
						<Label htmlFor="email">Email</Label>
						<Input id="email" placeholder="Email" type="email" autoComplete="email" name="email" />
						<InputError name="email" />
					</InputGroup>
					<InputGroup>
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							placeholder="Password"
							type="password"
							autoComplete="current-password"
							name="password"
						/>
						<InputError name="password" />
					</InputGroup>
					<Button
						type="submit"
						disabled={form.formState.isSubmitting}
						width="fit"
						color="primary"
						className="ml-auto"
					>
						{form.formState.isSubmitting ? "Submitting..." : "Sign In"}
					</Button>
				</Form>
			</FormProvider>
		</div>
	);
}
