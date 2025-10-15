import dotenv from "dotenv";
dotenv.config();
import app from "./app";

const port = (() => {
  const envPort = process.env.PORT;
  if (envPort) {
    const parsed = Number(envPort);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return 8080;
})();

app.listen(port as number, () => {
  console.log(`Server running on port ${port}`);
});
