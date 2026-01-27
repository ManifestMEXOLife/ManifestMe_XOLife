console.log("\n--- ENV VARIABLES");

// testSecret.ts
import { loadSecretToEnv } from "./src/config/secrets";

async function main() {
    console.log("Starting secret fetch and load...");

    await loadSecretToEnv("manifestme/prod/database", "DB");

    console.log("DB_HOST:", process.env.DB_DB_HOST);
    console.log("DB_PORT:", process.env.DB_DB_PORT);
    console.log("DB_NAME:", process.env.DB_DB_NAME);
    console.log("DB_USER:", process.env.DB_DB_USER);
    console.log("DB_PASSWORD:", process.env.DB_DB_PASSWORD);
}

main().catch(err => {
    console.error("Error in main:", err);
});
