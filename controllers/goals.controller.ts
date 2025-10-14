import { Request, Response } from "express";
import prisma from "../prisma.client";

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
  const goals = await prisma.goal.findMany({
    where: { userId: Number(userId) },
    include: { microGoals: true }
  });
  const summary = goals.map((g: any) => {
    const total = g.microGoals.length;
    const done = g.microGoals.filter((m: any) => m.completed).length;
    return { goalId: g.id, title: g.title, total, done, progress: total ? done / total : 0 };
  });
  return res.json({ summary });
};

export const getGoals = async (req: Request, res: Response) => {
  const goals = await prisma.goal.findMany();
  return res.json({ goals });
};