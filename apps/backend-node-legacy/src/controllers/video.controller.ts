import { Request, Response } from "express";
import prisma from "../../../../prisma.client";

export const requestMockVideo = async (req: Request, res: Response) => {
  const { goalId, prompt } = req.body;
  const providerId = `mock-${Date.now()}`;
  const url = `https://mock.video/${providerId}.mp4`;
  const video = await prisma.video.create({
    data: { provider: "mock", providerId, url, goal: { connect: { id: goalId } } }
  });
  return res.json({ status: "queued", video });
};

export const listVideosForGoal = async (req: Request, res: Response) => {
  const { goalId } = req.params;
  const videos = await prisma.video.findMany({ where: { goal: { id: Number(goalId) } }});
  return res.json({ videos });
};