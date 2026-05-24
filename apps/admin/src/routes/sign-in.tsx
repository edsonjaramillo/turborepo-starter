import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Button } from "@repo/ui/button";
import { Form } from "@repo/ui/form";
import { Input, InputError, InputGroup, Label } from "@repo/ui/inputs";
import { signInFormSchema, type SignInFormData } from "@repo/validation/forms";
import { createFileRoute } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";

import { apiClient } from "#/lib/admin-api-client.ts";

export const Route = createFileRoute("/sign-in")({
	component: RouteComponent,
});

function RouteComponent() {
	const form = useForm<SignInFormData>({
		resolver: standardSchemaResolver(signInFormSchema),
	});
	const onSubmit = form.handleSubmit(async (data) => {
		await apiClient.auth.signIn(data);
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
