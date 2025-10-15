import dotenv from "dotenv";
import http from "http";
import app from "./app";

dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

// Create a server explicitly — this avoids TS overload confusion
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
