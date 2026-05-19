import { z } from "zod";

import { zEmail, zPassword } from "./core";

export const signInFormSchema = z.object({
	email: zEmail,
	password: zPassword,
});

export type SignInFormData = z.infer<typeof signInFormSchema>;
