import fs from "node:fs/promises";

import openapiTS, { astToString } from "openapi-typescript";

const env = process.env;
if (!env.API_PORT) {
	throw new Error("API_PORT environment variable is not set");
}

const ast = await openapiTS(
	new URL(`http://localhost:${env.API_PORT}/openapi/json`, import.meta.url),
);
const contents = astToString(ast);

// (optional) write to file

await fs.writeFile("./src/api-open-api-schema.ts", contents);
