import process from "node:process";

import { z } from "zod";

export function parseEnv<T extends z.ZodType>(schema: T, env: NodeJS.ProcessEnv): z.core.output<T> {
	const result = schema.safeParse(env);

	if (!result.success) {
		console.error(JSON.stringify(z.treeifyError(result.error), null, 2));
		return process.exit(1);
	}

	return result.data;
}
