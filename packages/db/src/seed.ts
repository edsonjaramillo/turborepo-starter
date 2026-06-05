import { hashPassword } from "@repo/security/password";

import { createDb } from "./client";
import { dbEnv } from "./env";
import { permissionsTable } from "./schema/permissions";
import { usersTable } from "./schema/users";
import { usersPermissionsTable } from "./schema/users-permissions";

const permissions = ["sessions:delete", "all"] as const;

type PermissionName = (typeof permissions)[number];

interface SeedUser {
	firstName: string;
	lastName: string;
	permissions?: readonly PermissionName[];
}

const users = [
	{
		firstName: "Edson",
		lastName: "Jaramillo",
		permissions: ["all"],
	},
	{
		firstName: "Tony",
		lastName: "Stark",
		permissions: ["sessions:delete"],
	},
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
] as const satisfies readonly SeedUser[];

const database = createDb({
	host: dbEnv.DATABASE_HOST,
	password: dbEnv.DATABASE_PASSWORD,
	port: dbEnv.DATABASE_PORT,
	user: dbEnv.DATABASE_USER,
	database: dbEnv.DATABASE_NAME,
});

async function seed() {
	await database.db.delete(usersTable);
	await database.db.delete(permissionsTable);

	const createdPermissions = await database.db
		.insert(permissionsTable)
		.values(permissions.map((name) => ({ name })))
		.returning({ id: permissionsTable.id, name: permissionsTable.name });

	const permissionIds = new Map(
		createdPermissions.map((permission) => [permission.name, permission.id]),
	);
	const getPermissionId = (permission: PermissionName) => {
		const permissionId = permissionIds.get(permission);

		if (!permissionId) {
			throw new Error(`Failed to seed permission ${permission}`);
		}

		return permissionId;
	};
	const passwordHash = await hashPassword("abcd1234");

	for (const userSeed of users) {
		const { firstName, lastName } = userSeed;
		const assignedPermissions = "permissions" in userSeed ? userSeed.permissions : undefined;
		const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
		const [user] = await database.db
			.insert(usersTable)
			.values({ firstName, lastName, email, passwordHash })
			.returning({ id: usersTable.id });

		if (!user) {
			throw new Error(`Failed to seed user ${email}`);
		}

		if (assignedPermissions?.length) {
			await database.db.insert(usersPermissionsTable).values(
				assignedPermissions.map((permission) => ({
					userId: user.id,
					permissionId: getPermissionId(permission),
				})),
			);
		}
	}
}

await seed();
