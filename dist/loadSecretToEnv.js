"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const secrets_1 = require("./src/config/secrets");
(async () => {
    await (0, secrets_1.loadSecretToEnv)("manifestme/prod/database", "DB");
    console.log(process.env.DB_HOST); // manifestme-db.cluster-c07a2mo60i1j.us-east-1.rds.amazonaws.com
})();
//# sourceMappingURL=loadSecretToEnv.js.map