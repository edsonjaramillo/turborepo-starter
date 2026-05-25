export interface PaginationInput {
	limit: number;
	offset: number;
}

export interface CreateUserInput {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}
