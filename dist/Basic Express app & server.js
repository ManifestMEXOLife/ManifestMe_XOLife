"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// This file has been split into separate modules:
// - app.ts: Express app configuration
// - server.ts: Server startup
// - routes/: Route definitions
const app_1 = __importDefault(require("./app"));
const port = process.env.PORT || 8080;
app_1.default.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//# sourceMappingURL=Basic%20Express%20app%20&%20server.js.map