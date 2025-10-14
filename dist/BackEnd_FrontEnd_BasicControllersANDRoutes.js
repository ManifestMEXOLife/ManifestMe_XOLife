"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const prisma_client_1 = __importDefault(require("./prisma.client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const register = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const existing = await prisma_client_1.default.user.findUnique({ where: { email } });
        if (existing)
            return res.status(400).json({ error: "Email exists" });
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_client_1.default.user.create({
            data: { email, name, passwordHash }
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET);
        return res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma_client_1.default.user.findUnique({ where: { email } });
        if (!user)
            return res.status(401).json({ error: "Invalid cred" });
        const ok = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!ok)
            return res.status(401).json({ error: "Invalid cred" });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET);
        return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.login = login;
//# sourceMappingURL=BackEnd_FrontEnd_BasicControllersANDRoutes.js.map