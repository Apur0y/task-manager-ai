import { Task } from "../models/task.model";

interface TaskInput {
  title: string;
  description?: string;
  category: string;
  date?: Date;
  priority?: string;
}

interface TaskUpdate {
  title?: string;
  description?: string;
  category?: string;
  date?: Date;
  status?: string;
  priority?: string;
}

// Create a new task
export const createTask = async (input: TaskInput) => {
  const taskDate = input.date ? new Date(input.date) : new Date();
  taskDate.setHours(0, 0, 0, 0);

  const task = new Task({
    title: input.title,
    description: input.description || null,
    category: input.category,
    date: taskDate,
    priority: input.priority || "medium",
    status: "pending",
  });

  return await task.save();
};

// Get today's tasks
export const getTodayTasks = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return await Task.find({
    date: { $gte: today, $lt: tomorrow },
  }).sort({ priority: -1, createdAt: 1 });
};

// Get tasks for a specific date
export const getTasksByDate = async (date: Date) => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  return await Task.find({
    date: { $gte: startDate, $lt: endDate },
  }).sort({ priority: -1, createdAt: 1 });
};

// Get tasks for a date range
export const getTasksByDateRange = async (startDate: Date, endDate: Date) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  return await Task.find({
    date: { $gte: start, $lte: end },
  }).sort({ date: -1, priority: -1, createdAt: 1 });
};

// Get incomplete tasks from previous days
export const getIncompleteTasksFromPreviousDays = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const incompleteIncomplete = await Task.find({
    date: { $lt: today },
    status: "incomplete",
  }).sort({ date: -1 });

  const incompletePending = await Task.find({
    date: { $lt: today },
    status: "pending",
  }).sort({ date: -1 });

  return [...incompleteIncomplete, ...incompletePending];
};

// Update a task
export const updateTask = async (id: string, updates: TaskUpdate) => {
  if (updates.date) {
    const updatedDate = new Date(updates.date);
    updatedDate.setHours(0, 0, 0, 0);
    updates.date = updatedDate;
  }

  return await Task.findByIdAndUpdate(id, updates, { new: true });
};

// Mark task as complete
export const markTaskAsComplete = async (id: string) => {
  return await Task.findByIdAndUpdate(
    id,
    {
      status: "completed",
      completedAt: new Date(),
    },
    { new: true }
  );
};

// Delete a task
export const deleteTask = async (id: string) => {
  return await Task.findByIdAndDelete(id);
};

// Complete all tasks for a date
export const completeAllTasksForDate = async (date: Date) => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  const result = await Task.updateMany(
    {
      date: { $gte: startDate, $lt: endDate },
      status: { $ne: "completed" },
    },
    {
      status: "completed",
      completedAt: new Date(),
    }
  );

  return await Task.find({
    date: { $gte: startDate, $lt: endDate },
  });
};

// Get last 90 days tasks
export const getLast90DaysTasks = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ninetyDaysAgo = new Date(today);
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  return await Task.find({
    date: { $gte: ninetyDaysAgo, $lte: today },
  }).sort({ date: -1 });
};

// Get category statistics for last 90 days
export const getCategoryStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ninetyDaysAgo = new Date(today);
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const stats = await Task.aggregate([
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
};

// Get progress by category for all time
export const getProgressByCategory = async () => {
  const progress = await Task.aggregate([
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
};
