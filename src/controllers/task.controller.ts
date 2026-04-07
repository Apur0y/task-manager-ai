import { Request, Response } from "express";
import {
  createTask,
  getTodayTasks,
  getTasksByDate,
  updateTask,
  deleteTask,
  getTasksByDateRange,
  getIncompleteTasksFromPreviousDays,
  completeAllTasksForDate,
  getCategoryStats,
  getLast90DaysTasks,
  markTaskAsComplete,
  getProgressByCategory,
  getAllTasks,
} from "../services/task.service";

// Create a new task
export const createNewTask = async (req: Request, res: Response) => {
  try {
    const { title, description, category, date, priority,resources } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        error: "Title and category are required",
      });
    }

    const task = await createTask({
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
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ error: String(err) });
  }
};

// Get today's tasks
export const getTodayTasksController = async (_req: Request, res: Response) => {
  try {
    const tasks = await getTodayTasks();
    res.json({
      success: true,
      date: new Date().toDateString(),
      tasks,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === "completed").length,
      pendingTasks: tasks.filter((t) => t.status === "pending").length,
      incompleteTasks: tasks.filter((t) => t.status === "incomplete").length,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

export const getAllTask=async(req: Request, res: Response)=>{
  try {
    const tasks=await getAllTasks();
    res.json({
       success: true,
       tasks

    })
  } catch (error) {
    
  }
}

// Get tasks for a specific date
export const getTasksByDateController = async (req: Request, res: Response) => {
  try {
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({ error: "Date is required (YYYY-MM-DD)" });
    }

    const tasks = await getTasksByDate(new Date(date));

    res.json({
      success: true,
      date,
      tasks,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === "completed").length,
      pendingTasks: tasks.filter((t) => t.status === "pending").length,
      incompleteTasks: tasks.filter((t) => t.status === "incomplete").length,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

// Get tasks for a date range
export const getTasksByDateRangeController = async (
  req: Request,
  res: Response
) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        error: "Both startDate and endDate are required (YYYY-MM-DD)",
      });
    }

    const tasks = await getTasksByDateRange(
      new Date(startDate as string),
      new Date(endDate as string)
    );

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
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

// Get incomplete tasks from previous days
export const getIncompleteTasksController = async (
  _req: Request,
  res: Response
) => {
  try {
    const tasks = await getIncompleteTasksFromPreviousDays();

    res.json({
      success: true,
      message: "Incomplete tasks from previous days",
      tasks,
      totalIncompleteTasks: tasks.length,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

// Update a task
export const updateTaskController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await updateTask(id, updates);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

// Mark task as complete
export const markTaskCompleteController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const task = await markTaskAsComplete(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({
      success: true,
      message: "Task marked as completed",
      task,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

// Delete a task
export const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await deleteTask(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({
      success: true,
      message: "Task deleted successfully",
      task,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

// Complete all tasks for a date
export const completeAllTasksController = async (
  req: Request,
  res: Response
) => {
  try {
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({ error: "Date is required (YYYY-MM-DD)" });
    }

    const tasks = await completeAllTasksForDate(new Date(date));

    res.json({
      success: true,
      message: `All tasks for ${date} have been marked as completed`,
      totalTasksCompleted: tasks.length,
      tasks,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

// Get last 90 days tasks
export const getLast90DaysController = async (_req: Request, res: Response) => {
  try {
    const tasks = await getLast90DaysTasks();

    res.json({
      success: true,
      message: "Last 90 days tasks",
      totalTasks: tasks.length,
      tasks,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

// Get category statistics
export const getCategoryStatsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const stats = await getCategoryStats();

    res.json({
      success: true,
      message: "Category statistics",
      categories: stats,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

// Get progress by category
export const getProgressByCategoryController = async (
  _req: Request,
  res: Response
) => {
  try {
    const progress = await getProgressByCategory();

    res.json({
      success: true,
      message: "Progress by category",
      progress,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};
