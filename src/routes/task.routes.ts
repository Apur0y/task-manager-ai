import { Router } from "express";
import {
  createNewTask,
  getTodayTasksController,
  getTasksByDateController,
  getTasksByDateRangeController,
  getIncompleteTasksController,
  updateTaskController,
  markTaskCompleteController,
  deleteTaskController,
  completeAllTasksController,
  getLast90DaysController,
  getCategoryStatsController,
  getProgressByCategoryController,
} from "../controllers/task.controller";

const taskRouter = Router();

// Create task
taskRouter.post("/", createNewTask);

// Get tasks
taskRouter.get("/today", getTodayTasksController);
taskRouter.get("/date/:date", getTasksByDateController);
taskRouter.get("/", getTasksByDateRangeController);
taskRouter.get("/incomplete/previous", getIncompleteTasksController);
taskRouter.get("/last90days", getLast90DaysController);

// Get statistics
taskRouter.get("/stats/category", getCategoryStatsController);
taskRouter.get("/stats/progress", getProgressByCategoryController);

// Update tasks
taskRouter.put("/:id", updateTaskController);
taskRouter.patch("/:id/complete", markTaskCompleteController);
taskRouter.delete("/:id", deleteTaskController);

// Complete all for date
taskRouter.patch("/complete-all/:date", completeAllTasksController);

export default taskRouter;
