import { apiEnv } from "./api-env";
import { app } from "./app";

await app.listen({ host: "0.0.0.0", port: apiEnv.API_PORT });

console.warn(`API server is running on http://localhost:${apiEnv.API_PORT}`);
