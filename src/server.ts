import dotenv from "dotenv";
import app from "./index";

dotenv.config();

const PORT = Number(process.env.PORT) || 5050;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

server.on("error", (error) => {
  console.error("Server error:", error);
});