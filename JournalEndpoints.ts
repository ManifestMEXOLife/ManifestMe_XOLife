import { Request, Response } from "express";
import prisma from "./prisma/client";

export const createJournal = async (req: Request, res: Response) => {
  const { userId, mood, moodScore, content } = req.body;
  const entry = await prisma.journalEntry.create({
    data: { userId, mood, moodScore, content }
  });
  return res.json({ entry });
};

