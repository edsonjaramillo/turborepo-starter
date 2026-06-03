import { zString } from "@repo/validation/core";
import { z } from "zod";

export const userResponseSchema = z.array(
	z.object({
		id: zString,
		firstName: zString,
		lastName: zString,
	}),
);
