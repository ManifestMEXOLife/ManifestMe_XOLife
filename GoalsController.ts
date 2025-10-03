import { Request, Response } from "express";
import prisma from "../prisma/client";

export const createGoal = async (req: Request, res: Response) => {
  const { userId, title, description, category } = req.body;
  const goal = await prisma.goal.create({
    data: { userId, title, description, category }
  });
  return res.json({ goal });
};

export const addMicroGoal = async (req: Request, res: Response) => {
  const { goalId, title, dueDate } = req.body;
  const mg = await prisma.microGoal.create({
    data: { goalId, title, dueDate: dueDate ? new Date(dueDate) : undefined }
  });
  return res.json({ microGoal: mg });
};

export const getProgress = async (req: Request, res: Response) => {
  const { userId } = req.params;
  // Example: calculate simple progress as microgoals completed / total
  const goals = await prisma.goal.findMany({
    where: { userId: Number(userId) },
    include: { microGoals: true }
  });
  const summary = goals.map(g => {
    const total = g.microGoals.length;
    const done = g.microGoals.filter(m => m.completed).length;
    return { goalId: g.id, title: g.title, total, done, progress: total ? done / total : 0 };
  });
  return res.json({ summary });
};




______________



import { Router } from "express";
import { createGoal, addMicroGoal, getProgress } from "../controllers/goals.controller";

const router = Router();
router.post("/", createGoal);
router.post("/micro", addMicroGoal);
router.get("/progress/:userId", getProgress);

export default router;
