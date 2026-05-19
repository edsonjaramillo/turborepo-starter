import { zEmail, zPassword, zString } from "@repo/validation/core";
import { pgTable, text } from "drizzle-orm/pg-core";
import { z } from "zod";

import { createdAt, id, updatedAt } from "./shared";

export const usersTable = pgTable("users", {
	id,
	createdAt,
	updatedAt,
	name: text().notNull(),
	email: text().notNull().unique(),
	password: text().notNull(),
});

export const selectUserSchema = z.object({
	id: zString,
	name: zString,
	email: zEmail,
});

export const userColumns = {
	id: true,
	name: true,
	email: true,
} as const;

export const selectUserSessionSchema = z.object({
	name: zString,
	email: zEmail,
});

export const userSessionColumns = {
	name: true,
	email: true,
} as const;

export const insertUserSchema = z.object({
	name: zString.meta({ example: "Tony Stark" }),
	email: zEmail.meta({ example: "tony.stark@example.com" }),
	password: zPassword.meta({ example: "abcd1234" }),
});

export type CreateUserSchema = z.infer<typeof insertUserSchema>;
