"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProgressByCategoryController = exports.getCategoryStatsController = exports.getLast90DaysController = exports.completeAllTasksController = exports.deleteTaskController = exports.markTaskCompleteController = exports.updateTaskController = exports.getIncompleteTasksController = exports.getTasksByDateRangeController = exports.getTasksByDateController = exports.getAllTask = exports.getTodayTasksController = exports.createNewTask = void 0;
const task_service_1 = require("../services/task.service");
// Create a new task
const createNewTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, category, date, priority, resources } = req.body;
        if (!title || !category) {
            return res.status(400).json({
                error: "Title and category are required",
            });
        }
        const task = yield (0, task_service_1.createTask)({
            title,
            description,
            category,
            date,
            priority,
            resources
        });
        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task,
        });
    }
    catch (err) {
        console.error("Create task error:", err);
        res.status(500).json({ error: String(err) });
    }
});
exports.createNewTask = createNewTask;
// Get today's tasks
const getTodayTasksController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield (0, task_service_1.getTodayTasks)();
        res.json({
            success: true,
            date: new Date().toDateString(),
            tasks,
            totalTasks: tasks.length,
            completedTasks: tasks.filter((t) => t.status === "completed").length,
            pendingTasks: tasks.filter((t) => t.status === "pending").length,
            incompleteTasks: tasks.filter((t) => t.status === "incomplete").length,
        });
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
exports.getTodayTasksController = getTodayTasksController;
const getAllTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield (0, task_service_1.getAllTasks)();
        res.json({
            success: true,
            tasks
        });
    }
    catch (error) {
    }
});
exports.getAllTask = getAllTask;
// Get tasks for a specific date
const getTasksByDateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date } = req.params;
        if (!date) {
            return res.status(400).json({ error: "Date is required (YYYY-MM-DD)" });
        }
        const tasks = yield (0, task_service_1.getTasksByDate)(new Date(date));
        res.json({
            success: true,
            date,
            tasks,
            totalTasks: tasks.length,
            completedTasks: tasks.filter((t) => t.status === "completed").length,
            pendingTasks: tasks.filter((t) => t.status === "pending").length,
            incompleteTasks: tasks.filter((t) => t.status === "incomplete").length,
        });
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
exports.getTasksByDateController = getTasksByDateController;
// Get tasks for a date range
const getTasksByDateRangeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({
                error: "Both startDate and endDate are required (YYYY-MM-DD)",
            });
        }
        const tasks = yield (0, task_service_1.getTasksByDateRange)(new Date(startDate), new Date(endDate));
        res.json({
            success: true,
            startDate,
            endDate,
            tasks,
            totalTasks: tasks.length,
            completedTasks: tasks.filter((t) => t.status === "completed").length,
            pendingTasks: tasks.filter((t) => t.status === "pending").length,
            incompleteTasks: tasks.filter((t) => t.status === "incomplete").length,
        });
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
exports.getTasksByDateRangeController = getTasksByDateRangeController;
// Get incomplete tasks from previous days
const getIncompleteTasksController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield (0, task_service_1.getIncompleteTasksFromPreviousDays)();
        res.json({
            success: true,
            message: "Incomplete tasks from previous days",
            tasks,
            totalIncompleteTasks: tasks.length,
        });
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
exports.getIncompleteTasksController = getIncompleteTasksController;
// Update a task
const updateTaskController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        const task = yield (0, task_service_1.updateTask)(id, updates);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({
            success: true,
            message: "Task updated successfully",
            task,
        });
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
exports.updateTaskController = updateTaskController;
// Mark task as complete
const markTaskCompleteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const task = yield (0, task_service_1.markTaskAsComplete)(id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({
            success: true,
            message: "Task marked as completed",
            task,
        });
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
exports.markTaskCompleteController = markTaskCompleteController;
// Delete a task
const deleteTaskController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const task = yield (0, task_service_1.deleteTask)(id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({
            success: true,
            message: "Task deleted successfully",
            task,
        });
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
exports.deleteTaskController = deleteTaskController;
// Complete all tasks for a date
const completeAllTasksController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date } = req.params;
        if (!date) {
            return res.status(400).json({ error: "Date is required (YYYY-MM-DD)" });
        }
        const tasks = yield (0, task_service_1.completeAllTasksForDate)(new Date(date));
        res.json({
            success: true,
            message: `All tasks for ${date} have been marked as completed`,
            totalTasksCompleted: tasks.length,
            tasks,
        });
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
exports.completeAllTasksController = completeAllTasksController;
// Get last 90 days tasks
const getLast90DaysController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield (0, task_service_1.getLast90DaysTasks)();
        res.json({
            success: true,
            message: "Last 90 days tasks",
            totalTasks: tasks.length,
            tasks,
        });
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
exports.getLast90DaysController = getLast90DaysController;
// Get category statistics
const getCategoryStatsController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield (0, task_service_1.getCategoryStats)();
        res.json({
            success: true,
            message: "Category statistics",
            categories: stats,
        });
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
exports.getCategoryStatsController = getCategoryStatsController;
// Get progress by category
const getProgressByCategoryController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const progress = yield (0, task_service_1.getProgressByCategory)();
        res.json({
            success: true,
            message: "Progress by category",
            progress,
        });
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
exports.getProgressByCategoryController = getProgressByCategoryController;
