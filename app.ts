import express from "express";
import cors from "cors";
import "express-async-errors";
import authRoutes from "./routes/auth.routes";
import goalsRoutes from "./routes/goals.routes";
import videoRoutes from "./routes/video.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/videos", videoRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

// basic error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Server error" });
});

export default app;