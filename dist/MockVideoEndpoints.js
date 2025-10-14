"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listVideosForGoal = exports.requestMockVideo = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const requestMockVideo = async (req, res) => {
    // Accept prompt payload, store a Video row with provider 'mock'
    const { goalId, prompt } = req.body;
    // simulate provider response
    const providerId = `mock-${Date.now()}`;
    const url = `https://mock.video/${providerId}.mp4`;
    const video = await client_1.default.video.create({
        data: { provider: "mock", providerId, url, goal: { connect: { id: goalId } } }
    });
    // In real integration, you'd enqueue job to call vendor API and update record later
    return res.json({ status: "queued", video });
};
exports.requestMockVideo = requestMockVideo;
const listVideosForGoal = async (req, res) => {
    const { goalId } = req.params;
    const videos = await client_1.default.video.findMany({ where: { goalId: Number(goalId) } });
    return res.json({ videos });
};
exports.listVideosForGoal = listVideosForGoal;
____________;
const express_1 = require("express");
const video_controller_1 = require("../controllers/video.controller");
const router = (0, express_1.Router)();
router.post("/request", exports.requestMockVideo);
router.get("/goal/:goalId", exports.listVideosForGoal);
exports.default = router;
//# sourceMappingURL=MockVideoEndpoints.js.map