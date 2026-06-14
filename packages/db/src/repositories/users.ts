import type { Database } from "../client";
import { usersTable } from "../schema/users";
import type { PaginationInput } from "../types";

interface CreateUserInput {
	firstName: string;
	lastName: string;
	email: string;
	passwordHash: string;
}

export function createUsersRepository(db: Database) {
	return {
		list(pagination: PaginationInput) {
			return db.query.usersTable.findMany({
				columns: { id: true, firstName: true, lastName: true },
				limit: pagination.limit,
				offset: pagination.offset,
			});
		},

		getByEmail(email: string) {
			return db.query.usersTable.findFirst({ where: { email }, columns: { passwordHash: true } });
		},

		async getSignInProfileByEmail(email: string) {
			const user = await db.query.usersTable.findFirst({
				where: { email },
				columns: { id: true, firstName: true, lastName: true, email: true, passwordHash: true },
			});

			return user;
		},

		async create(user: CreateUserInput) {
			await db.insert(usersTable).values(user);
		},
	};
}
