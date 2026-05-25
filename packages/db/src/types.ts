export interface PaginationInput {
	limit: number;
	offset: number;
}

export interface CreateUserInput {
	name: string;
	email: string;
	password: string;
}
