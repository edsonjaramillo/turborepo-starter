import { text, timestamp } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const id = text().notNull().primaryKey().$defaultFn(uuidv7);
export const createdAt = timestamp().notNull().defaultNow();
export const updatedAt = timestamp()
	.notNull()
	.defaultNow()
	.$onUpdate(() => new Date());

export const omitInsertColumns = {
	id: true,
	createdAt: true,
	updatedAt: true,
} as const;
