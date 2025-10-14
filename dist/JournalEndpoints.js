"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJournal = void 0;
const client_1 = __importDefault(require("./prisma/client"));
const createJournal = async (req, res) => {
    const { userId, mood, moodScore, content } = req.body;
    const entry = await client_1.default.journalEntry.create({
        data: { userId, mood, moodScore, content }
    });
    return res.json({ entry });
};
exports.createJournal = createJournal;
//# sourceMappingURL=JournalEndpoints.js.map