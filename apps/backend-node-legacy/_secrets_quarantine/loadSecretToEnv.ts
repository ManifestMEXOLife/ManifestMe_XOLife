import { loadSecretToEnv } from "./src/config/secrets";

(async () => {
  await loadSecretToEnv("manifestme/prod/database", "DB");
  console.log(process.env.DB_HOST); // manifestme-db.cluster-c07a2mo60i1j.us-east-1.rds.amazonaws.com
})();
