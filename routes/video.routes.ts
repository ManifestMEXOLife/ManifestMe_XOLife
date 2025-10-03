import { Router } from "express";
import { requestMockVideo, listVideosForGoal } from "../controllers/video.controller";

const router = Router();
router.post("/request", requestMockVideo);
router.get("/goal/:goalId", listVideosForGoal);

export default router;