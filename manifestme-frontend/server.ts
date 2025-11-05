import express from "express";
const app = express();
const port = 8080;

app.get("/health", (req, res) => {
  res.json({ message: "Backend is healthy ✅" });
});

app.listen(port, () => {
  console.log(`Server listening on 0.0.0.0:${port}`);
});
