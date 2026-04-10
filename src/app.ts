import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes";
import taskRoutes from "./routes/task.routes";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/ai", aiRoutes);
app.use("/api/tasks", taskRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});
app.get("/", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

export default app;
