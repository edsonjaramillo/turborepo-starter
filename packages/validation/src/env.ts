import process from "node:process";

import { z } from "zod";

export function parseEnv<T extends z.ZodTypeAny>(
	schema: T,
	env: NodeJS.ProcessEnv,
): z.core.output<T> {
	const result = schema.safeParse(env);

	if (result.error) {
		console.error(JSON.stringify(z.treeifyError(result.error), null, 2));
		process.exit(1);
	}

	return result.data;
}
