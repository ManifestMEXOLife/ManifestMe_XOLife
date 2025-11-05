import express from "express";
import cors from "cors";

const app = express();

// Allow requests from frontend
app.use(
  cors({
    origin: ["http://localhost:3000", "http://manifestme-env.eba-62aeuny5.us-east-1.elasticbeanstalk.com"],
    credentials: true,
  })
);

app.use(express.json());
