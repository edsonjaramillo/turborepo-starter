import type { Pagination } from "../../middleware/paginate";
import { db } from "../database-client";
import type { CreateUserSchema } from "../schema/users-schema";
import { userColumns, usersTable } from "../schema/users-schema";

export class UserQueries {
	static async getUsers(pagination: Pagination) {
		return await db.query.usersTable.findMany({
			columns: userColumns,
			limit: pagination.limit,
			offset: pagination.offset,
		});
	}

	static async getUserByEmail(email: string) {
		return await db.query.usersTable.findFirst({ where: { email }, columns: userColumns });
	}

	static async getUserCredentialsByEmail(email: string) {
		return await db.query.usersTable.findFirst({
			where: { email },
			columns: { id: true, name: true, email: true, password: true },
		});
	}

	static async createUser(user: CreateUserSchema) {
		await db.insert(usersTable).values(user);
	}
}
