"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const BackEnd_FrontEnd_PostgreSQL_Connection_1 = require("./BackEnd_FrontEnd_PostgreSQL_Connection");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const goals_routes_1 = __importDefault(require("./routes/goals.routes"));
const video_routes_1 = __importDefault(require("./routes/video.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/goals", goals_routes_1.default);
app.use("/api/videos", video_routes_1.default);
app.get("/health", (req, res) => res.json({ status: "ok" }));
(0, BackEnd_FrontEnd_PostgreSQL_Connection_1.connectDatabase)().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch((err) => console.error("Failed to start server:", err));
//# sourceMappingURL=BackEnd_FrontEndServerEntryPt.js.map