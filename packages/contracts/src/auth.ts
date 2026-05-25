import { zString } from "@repo/validation/core";
import { z } from "zod";

export const signInSessionResponseSchema = z.object({
	id: zString,
	firstName: zString,
	lastName: zString,
});
