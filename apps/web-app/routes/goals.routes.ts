import { Router } from "express";
import * as goalsController from "../controllers/goals.controller";

const router = Router();
router.get("/", goalsController.getGoals);
router.post("/", goalsController.createGoal);
router.post("/micro", goalsController.addMicroGoal);
router.get("/progress/:userId", goalsController.getProgress);

export default router;