"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listVideosForGoal = exports.requestMockVideo = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const requestMockVideo = async (req, res) => {
    const { goalId, prompt } = req.body;
    const providerId = `mock-${Date.now()}`;
    const url = `https://mock.video/${providerId}.mp4`;
    const video = await client_1.default.video.create({
        data: { provider: "mock", providerId, url, goal: { connect: { id: goalId } } }
    });
    return res.json({ status: "queued", video });
};
exports.requestMockVideo = requestMockVideo;
const listVideosForGoal = async (req, res) => {
    const { goalId } = req.params;
    const videos = await client_1.default.video.findMany({ where: { goal: { id: Number(goalId) } } });
    return res.json({ videos });
};
exports.listVideosForGoal = listVideosForGoal;
//# sourceMappingURL=video.controller.js.map