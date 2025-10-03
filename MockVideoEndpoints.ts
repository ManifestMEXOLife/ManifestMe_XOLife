import { Request, Response } from "express";
import prisma from "../prisma/client";

export const requestMockVideo = async (req: Request, res: Response) => {
  // Accept prompt payload, store a Video row with provider 'mock'
  const { goalId, prompt } = req.body;
  // simulate provider response
  const providerId = `mock-${Date.now()}`;
  const url = `https://mock.video/${providerId}.mp4`;
  const video = await prisma.video.create({
    data: { provider: "mock", providerId, url, goal: { connect: { id: goalId } } }
  });
  // In real integration, you'd enqueue job to call vendor API and update record later
  return res.json({ status: "queued", video });
};

export const listVideosForGoal = async (req: Request, res: Response) => {
  const { goalId } = req.params;
  const videos = await prisma.video.findMany({ where: { goalId: Number(goalId) }});
  return res.json({ videos });
};




____________



import { Router } from "express";
import { requestMockVideo, listVideosForGoal } from "../controllers/video.controller";
const router = Router();
router.post("/request", requestMockVideo);
router.get("/goal/:goalId", listVideosForGoal);
export default router;
