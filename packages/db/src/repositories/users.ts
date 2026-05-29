import type { Database } from "../client";
import { userColumns, usersTable } from "../schema/users";
import type { CreateUserInput, PaginationInput } from "../types";

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
			return await db.query.usersTable.findFirst({ where: { email }, columns: userColumns });
		},

		async getSignInProfileByEmail(email: string) {
			const user = await db.query.usersTable.findFirst({
				where: { email },
				columns: { id: true, firstName: true, lastName: true, email: true, password: true },
				with: { permissions: { columns: { id: true, name: true } } },
			});

			if (!user) {
				return undefined;
			}

			return user;
		},

		async create(user: CreateUserInput) {
			await db.insert(usersTable).values({ ...user, email: user.email });
		},
	};
}
