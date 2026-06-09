export class APIClientError extends Error {
	constructor(
		message: string,
		public status: number,
	) {
		super(message);
		this.name = "APIClientError";
	}
}
