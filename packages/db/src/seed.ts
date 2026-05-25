import process from "node:process";

import { hashPassword } from "@repo/security/password";

import { createDb } from "./client";
import { dbEnv } from "./env";
import { usersTable } from "./schema/users";

const names = [
	"Steve Rogers",
	"Bruce Banner",
	"Natasha Romanoff",
	"Clint Barton",
	"Thor Odinson",
	"Wanda Maximoff",
	"Peter Parker",
	"Stephen Strange",
	"Eddie Brock",
	"Peter Quill",
];

const database = createDb({
	host: dbEnv.DATABASE_HOST,
	password: dbEnv.DATABASE_PASSWORD,
	port: dbEnv.DATABASE_PORT,
	user: dbEnv.DATABASE_USER,
	database: dbEnv.DATABASE_NAME,
});

async function seed() {
	await database.db.delete(usersTable);

	for (const name of names) {
		const [firstName, lastName] = name.toLowerCase().split(" ");
		const email = `${firstName}.${lastName}@example.com`;
		const password = await hashPassword("abcd1234");

		await database.users.create({
			name,
			email,
			password,
		});
	}
}

seed()
	.catch(console.error)
	.finally(() => process.exit());
