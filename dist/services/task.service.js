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
exports.getProgressByCategory = exports.getCategoryStats = exports.getLast90DaysTasks = exports.completeAllTasksForDate = exports.deleteTask = exports.markTaskAsComplete = exports.updateTask = exports.getIncompleteTasksFromPreviousDays = exports.getTasksByDateRange = exports.getTasksByDate = exports.getAllTasks = exports.getTodayTasks = exports.createTask = void 0;
const task_model_1 = require("../models/task.model");
// Create a new task
const createTask = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const taskDate = input.date ? new Date(input.date) : new Date();
    taskDate.setHours(0, 0, 0, 0);
    const task = new task_model_1.Task({
        title: input.title,
        description: input.description || null,
        category: input.category,
        date: taskDate,
        priority: input.priority || "medium",
        status: "pending",
        resources: input.resources || []
    });
    return yield task.save();
});
exports.createTask = createTask;
// Get today's tasks
const getTodayTasks = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return yield task_model_1.Task.find({
        date: { $gte: today, $lt: tomorrow },
    }).sort({ priority: -1, createdAt: 1 });
});
exports.getTodayTasks = getTodayTasks;
const getAllTasks = () => __awaiter(void 0, void 0, void 0, function* () {
    return task_model_1.Task.find();
});
exports.getAllTasks = getAllTasks;
// Get tasks for a specific date
const getTasksByDate = (date) => __awaiter(void 0, void 0, void 0, function* () {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    return yield task_model_1.Task.find({
        date: { $gte: startDate, $lt: endDate },
    }).sort({ priority: -1, createdAt: 1 });
});
exports.getTasksByDate = getTasksByDate;
// Get tasks for a date range
const getTasksByDateRange = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return yield task_model_1.Task.find({
        date: { $gte: start, $lte: end },
    }).sort({ date: -1, priority: -1, createdAt: 1 });
});
exports.getTasksByDateRange = getTasksByDateRange;
// Get incomplete tasks from previous days
const getIncompleteTasksFromPreviousDays = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const incompleteIncomplete = yield task_model_1.Task.find({
        date: { $lt: today },
        status: "incomplete",
    }).sort({ date: -1 });
    const incompletePending = yield task_model_1.Task.find({
        date: { $lt: today },
        status: "pending",
    }).sort({ date: -1 });
    return [...incompleteIncomplete, ...incompletePending];
});
exports.getIncompleteTasksFromPreviousDays = getIncompleteTasksFromPreviousDays;
// Update a task
const updateTask = (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
    if (updates.date) {
        const updatedDate = new Date(updates.date);
        updatedDate.setHours(0, 0, 0, 0);
        updates.date = updatedDate;
    }
    return yield task_model_1.Task.findByIdAndUpdate(id, updates, { new: true });
});
exports.updateTask = updateTask;
// Mark task as complete
const markTaskAsComplete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield task_model_1.Task.findByIdAndUpdate(id, {
        status: "completed",
        completedAt: new Date(),
    }, { new: true });
});
exports.markTaskAsComplete = markTaskAsComplete;
// Delete a task
const deleteTask = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield task_model_1.Task.findByIdAndUpdate(id, {
        status: "deleted",
        completedAt: new Date(),
    }, { new: true });
});
exports.deleteTask = deleteTask;
// Complete all tasks for a date
const completeAllTasksForDate = (date) => __awaiter(void 0, void 0, void 0, function* () {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    const result = yield task_model_1.Task.updateMany({
        date: { $gte: startDate, $lt: endDate },
        status: { $ne: "completed" },
    }, {
        status: "completed",
        completedAt: new Date(),
    });
    return yield task_model_1.Task.find({
        date: { $gte: startDate, $lt: endDate },
    });
});
exports.completeAllTasksForDate = completeAllTasksForDate;
// Get last 90 days tasks
const getLast90DaysTasks = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ninetyDaysAgo = new Date(today);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    return yield task_model_1.Task.find({
        date: { $gte: ninetyDaysAgo, $lte: today },
    }).sort({ date: -1 });
});
exports.getLast90DaysTasks = getLast90DaysTasks;
// Get category statistics for last 90 days
const getCategoryStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ninetyDaysAgo = new Date(today);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const stats = yield task_model_1.Task.aggregate([
        {
            $match: {
                date: { $gte: ninetyDaysAgo, $lte: today },
            },
        },
        {
            $group: {
                _id: "$category",
                total: { $sum: 1 },
                completed: {
                    $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
                },
                pending: {
                    $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
                },
                incomplete: {
                    $sum: { $cond: [{ $eq: ["$status", "incomplete"] }, 1, 0] },
                },
            },
        },
    ]);
    return stats.map((stat) => ({
        category: stat._id,
        total: stat.total,
        completed: stat.completed,
        pending: stat.pending,
        incomplete: stat.incomplete,
        completionPercentage: ((stat.completed / stat.total) * 100).toFixed(2) + "%",
    }));
});
exports.getCategoryStats = getCategoryStats;
// Get progress by category for all time
const getProgressByCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    const progress = yield task_model_1.Task.aggregate([
        {
            $group: {
                _id: "$category",
                total: { $sum: 1 },
                completed: {
                    $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
                },
            },
        },
    ]);
    return progress.map((p) => ({
        category: p._id,
        completionPercentage: ((p.completed / p.total) * 100).toFixed(2) + "%",
        completed: p.completed,
        total: p.total,
    }));
});
exports.getProgressByCategory = getProgressByCategory;
