"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJournal = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const createJournal = async (req, res) => {
    const { userId, mood, moodScore, content } = req.body;
    const entry = await client_1.default.journalEntry.create({
        data: { userId, mood, moodScore, content }
    });
    return res.json({ entry });
};
exports.createJournal = createJournal;
///// add the following code to JournalEndpoints.ts ///
const express_1 = require("express");
const journal_controller_1 = require("../controllers/journal.controller");
const router = (0, express_1.Router)();
router.post("/", exports.createJournal);
exports.default = router;
//# sourceMappingURL=JournalEndpoints.js.map