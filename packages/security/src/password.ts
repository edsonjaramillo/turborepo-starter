import argon2 from "argon2";

const hashOptions: argon2.Options = {
	type: argon2.argon2id,
	memoryCost: 65536,
	timeCost: 3,
	parallelism: 4,
};

export async function hashPassword(password: string) {
	return argon2.hash(password, hashOptions);
}

export async function verifyPassword(hash: string, password: string) {
	return argon2.verify(hash, password, hashOptions);
}
