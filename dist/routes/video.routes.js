"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const video_controller_1 = require("../controllers/video.controller");
const router = (0, express_1.Router)();
router.post("/request", video_controller_1.requestMockVideo);
router.get("/goal/:goalId", video_controller_1.listVideosForGoal);
exports.default = router;
//# sourceMappingURL=video.routes.js.map