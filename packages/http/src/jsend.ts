import { z } from "zod";

// Schema factory for success responses
export function JSendSuccessSchema<T extends z.ZodType>(
	payload: T,
): z.ZodObject<{
	status: z.ZodLiteral<"success">;
	payload: T;
	message: z.ZodString;
}> {
	return z.object({
		status: z.literal("success"),
		payload,
		message: z.string(),
	});
}

// Schema factory for info responses
export function JSendInfoSchema<T extends z.ZodType>(
	payload: T,
): z.ZodObject<{
	status: z.ZodLiteral<"info">;
	payload: T;
	message: z.ZodString;
}> {
	return z.object({
		status: z.literal("info"),
		payload,
		message: z.string(),
	});
}

// Schema factory for error responses
export function JSendErrorSchema(): z.ZodObject<{
	status: z.ZodLiteral<"error">;
	message: z.ZodString;
}> {
	return z.object({
		status: z.literal("error"),
		message: z.string(),
	});
}

// Schema factory for redirect responses
export function JSendRedirectSchema(): z.ZodObject<{
	status: z.ZodLiteral<"redirect">;
	payload: z.ZodObject<{ path: z.ZodString }>;
	message: z.ZodString;
	redirect: z.ZodString;
}> {
	return z.object({
		status: z.literal("redirect"),
		payload: z.object({ path: z.string() }),
		message: z.string(),
		redirect: z.string(),
	});
}

// Infer types from schemas
export interface JSendSuccess<T> {
	status: "success";
	payload: T;
	message: string;
}

export interface JSendInfo<T> {
	status: "info";
	payload: T;
	message: string;
}

export type JSendError = z.infer<ReturnType<typeof JSendErrorSchema>>;

export type JSendRedirect = z.infer<ReturnType<typeof JSendRedirectSchema>>;

// Helper object with factory methods
export const JSend = {
	success<T>(payload: T, message: string): JSendSuccess<T> {
		return { status: "success", payload, message };
	},

	info<T>(payload: T, message: string): JSendInfo<T> {
		return { status: "info", payload, message };
	},

	error(message: string): JSendError {
		return { status: "error", message };
	},

	redirect(path: string, message: string): JSendRedirect {
		return { status: "redirect", payload: { path }, message, redirect: path };
	},
};
