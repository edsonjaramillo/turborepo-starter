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
		async list(pagination: PaginationInput) {
			return await db.query.usersTable.findMany({
				columns: {
					id: true,
					firstName: true,
					lastName: true,
				},
				limit: pagination.limit,
				offset: pagination.offset,
			});
		},

		async getByEmail(email: string) {
			return await db.query.usersTable.findFirst({
				where: { email },
				columns: { passwordHash: true },
			});
		},

		async getSignInProfileByEmail(email: string) {
			const user = await db.query.usersTable.findFirst({
				where: { email },
				columns: { id: true, firstName: true, lastName: true, email: true, passwordHash: true },
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
