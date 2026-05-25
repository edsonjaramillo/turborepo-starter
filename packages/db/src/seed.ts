import { hashPassword } from "@repo/security/password";

import { createDb } from "./client";
import { dbEnv } from "./env";
import { usersTable } from "./schema/users";

const users = [
	{
		firstName: "Steve",
		lastName: "Rogers",
	},
	{
		firstName: "Bruce",
		lastName: "Banner",
	},
	{
		firstName: "Natasha",
		lastName: "Romanoff",
	},
	{
		firstName: "Clint",
		lastName: "Barton",
	},
	{
		firstName: "Thor",
		lastName: "Odinson",
	},
	{
		firstName: "Wanda",
		lastName: "Maximoff",
	},
	{
		firstName: "Peter",
		lastName: "Parker",
	},
	{
		firstName: "Stephen",
		lastName: "Strange",
	},
	{
		firstName: "Eddie",
		lastName: "Brock",
	},
	{
		firstName: "Peter",
		lastName: "Quill",
	},
] as const;

const database = createDb({
	host: dbEnv.DATABASE_HOST,
	password: dbEnv.DATABASE_PASSWORD,
	port: dbEnv.DATABASE_PORT,
	user: dbEnv.DATABASE_USER,
	database: dbEnv.DATABASE_NAME,
});

async function seed() {
	await database.db.delete(usersTable);
	const password = await hashPassword("abcd1234");

	for (const { firstName, lastName } of users) {
		const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
		await database.users.create({
			firstName,
			lastName,
			email,
			password,
		});
	}
}

await seed();
