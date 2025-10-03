import express from "express";
import cors from "cors";
import { connectDatabase } from "./BackEnd_FrontEnd_PostgreSQL_Connection";
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

connectDatabase().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch((err: any) => console.error("Failed to start server:", err));
