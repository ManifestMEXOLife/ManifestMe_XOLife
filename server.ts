import dotenv from "dotenv";
dotenv.config();
import app from "./app";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
