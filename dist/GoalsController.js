"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProgress = exports.addMicroGoal = exports.createGoal = void 0;
const client_1 = __importDefault(require("./prisma/client"));
const createGoal = async (req, res) => {
    const { userId, title, description, category } = req.body;
    const goal = await client_1.default.goal.create({
        data: { userId, title, description, category }
    });
    return res.json({ goal });
};
exports.createGoal = createGoal;
const addMicroGoal = async (req, res) => {
    const { goalId, title, dueDate } = req.body;
    const mg = await client_1.default.microGoal.create({
        data: { goalId, title, dueDate: dueDate ? new Date(dueDate) : undefined }
    });
    return res.json({ microGoal: mg });
};
exports.addMicroGoal = addMicroGoal;
const getProgress = async (req, res) => {
    const { userId } = req.params;
    // Example: calculate simple progress as microgoals completed / total
    const goals = await client_1.default.goal.findMany({
        where: { userId: Number(userId) },
        include: { microGoals: true }
    });
    const summary = goals.map((g) => {
        const total = g.microGoals.length;
        const done = g.microGoals.filter((m) => m.completed).length;
        return { goalId: g.id, title: g.title, total, done, progress: total ? done / total : 0 };
    });
    return res.json({ summary });
};
exports.getProgress = getProgress;
//# sourceMappingURL=GoalsController.js.map