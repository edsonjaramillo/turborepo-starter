import type { Database } from "../client";
import { userColumns, usersTable } from "../schema/users";
import type { CreateUserInput, PaginationInput } from "../types";

function normalizeEmail(email: string) {
	return email.trim().toLowerCase();
}

export function createUsersRepository(db: Database) {
	return {
		async list(pagination: PaginationInput) {
			return await db.query.usersTable.findMany({
				columns: userColumns,
				limit: pagination.limit,
				offset: pagination.offset,
			});
		},

		async getByEmail(email: string) {
			return await db.query.usersTable.findFirst({
				where: { email: normalizeEmail(email) },
				columns: userColumns,
			});
		},

		async getCredentialsByEmail(email: string) {
			return await db.query.usersTable.findFirst({
				where: { email: normalizeEmail(email) },
				columns: { id: true, name: true, email: true, password: true },
			});
		},

		async create(user: CreateUserInput) {
			await db.insert(usersTable).values({ ...user, email: normalizeEmail(user.email) });
		},
	};
}
