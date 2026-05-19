import argon2 from "argon2";

const hashOptions: argon2.Options = {
	type: argon2.argon2id,
	memoryCost: 65536,
	timeCost: 3,
	parallelism: 4,
};

export class Password {
	static async hash(password: string) {
		return argon2.hash(password, hashOptions);
	}

	static async verify(hash: string, password: string) {
		return argon2.verify(hash, password, hashOptions);
	}
}
