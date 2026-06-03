import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { signUpBodySchema, type SignUpBody } from "@repo/contracts/auth-contracts";
import { Button } from "@repo/ui/button";
import { Form } from "@repo/ui/form";
import { Input, InputError, InputGroup, Label } from "@repo/ui/inputs";
import { createFileRoute } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";

export const Route = createFileRoute("/sign-up")({
	component: RouteComponent,
});

function RouteComponent() {
	const form = useForm<SignUpBody>({ resolver: standardSchemaResolver(signUpBodySchema) });
	const onSubmit = form.handleSubmit(() => {});
	return (
		<div>
			<FormProvider {...form}>
				<Form className="mx-auto space-y-5 p-6" onSubmit={onSubmit}>
					<InputGroup>
						<Label htmlFor="name">Name</Label>
						<Input id="name" placeholder="Name" type="text" autoComplete="name" name="name" />
						<InputError name="name" />
					</InputGroup>
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
							autoComplete="new-password"
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
						{form.formState.isSubmitting ? "Submitting..." : "Sign Up"}
					</Button>
				</Form>
			</FormProvider>
		</div>
	);
}
