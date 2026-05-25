import { timestamp, uuid } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const id = uuid().primaryKey().$defaultFn(uuidv7);

export const createdAt = timestamp({ withTimezone: true }).notNull().defaultNow();

export const updatedAt = timestamp({ withTimezone: true })
	.notNull()
	.defaultNow()
	.$onUpdate(() => new Date());
