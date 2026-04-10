"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const taskRouter = (0, express_1.Router)();
// Create task
taskRouter.post("/", task_controller_1.createNewTask);
// Get tasks
taskRouter.get("/", task_controller_1.getAllTask);
taskRouter.get("/today", task_controller_1.getTodayTasksController);
taskRouter.get("/date/:date", task_controller_1.getTasksByDateController);
taskRouter.get("/", task_controller_1.getTasksByDateRangeController);
taskRouter.get("/incomplete/previous", task_controller_1.getIncompleteTasksController);
taskRouter.get("/last90days", task_controller_1.getLast90DaysController);
// Get statistics
taskRouter.get("/stats/category", task_controller_1.getCategoryStatsController);
taskRouter.get("/stats/progress", task_controller_1.getProgressByCategoryController);
// Update tasks
taskRouter.put("/:id", task_controller_1.updateTaskController);
taskRouter.patch("/:id/complete", task_controller_1.markTaskCompleteController);
taskRouter.delete("/:id", task_controller_1.deleteTaskController);
// Complete all for date
taskRouter.patch("/complete-all/:date", task_controller_1.completeAllTasksController);
exports.default = taskRouter;
