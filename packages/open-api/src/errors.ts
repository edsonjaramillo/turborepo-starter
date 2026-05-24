export class APIClientError extends Error {
	constructor(
		message: string,
		public status?: number,
		public code?: string,
	) {
		super(message);
		this.name = "APIClientError";
	}
}
