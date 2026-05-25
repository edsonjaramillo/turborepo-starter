import process from "node:process";

import { zCoerceNumber, zString } from "@repo/validation/core";
import { parseEnv } from "@repo/validation/env";
import { z } from "zod";

const DbEnvSchema = z.object({
	DATABASE_USER: zString,
	DATABASE_PASSWORD: zString,
	DATABASE_HOST: zString,
	DATABASE_PORT: zCoerceNumber,
	DATABASE_NAME: zString,
});

export const dbEnv = parseEnv(DbEnvSchema, process.env);
