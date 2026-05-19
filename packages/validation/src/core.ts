import { z } from "zod";

export const zNodeEnv = z.enum(["development", "production"]);
export const zCoerceNumber = z.coerce.number();
export const zString = z.string();
export const zName = zString.min(2, { message: "Name must be at least 2 characters long" });
export const zDate = z.coerce.date();
export const zEmail = z.email();
export const zPassword = z
	.string()
	.min(8, { message: "Password must be at least 8 characters long" })
	.max(64, { message: "Password must be at most 64 characters long" });
