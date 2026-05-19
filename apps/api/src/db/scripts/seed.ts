import process from "node:process";

import { Password } from "../../utils/password";
import { db } from "../database-client";
import { UserQueries } from "../queries/user-queries";
import { usersTable } from "../schema/users-schema";

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

async function seed() {
	// delete all existing users
	await db.delete(usersTable);

	// create new users
	for (const name of names) {
		const [firstName, lastName] = name.toLowerCase().split(" ");
		const email = `${firstName}.${lastName}@example.com`;
		const hashedPassword = await Password.hash("abcd1234");
		await UserQueries.createUser({
			name,
			email,
			password: hashedPassword,
		});
	}
}

seed()
	.catch(console.error)
	.finally(() => process.exit());
