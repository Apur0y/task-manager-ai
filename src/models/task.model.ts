import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      enum: ["DSA", "Docker", "Problem Solving", "Projects", "Learning", "Code Review", "Other"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: () => new Date(new Date().toDateString()),
    },
    status: {
      type: String,
      enum: ["pending", "completed", "incomplete"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    completedAt: {
      type: Date,
      default: null,
    },
    linkedFromDate: {
      type: Date,
      default: null,
    },
    isCarriedOver: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

taskSchema.index({ date: 1, category: 1 });
taskSchema.index({ date: 1, status: 1 });

export const Task = mongoose.model("Task", taskSchema);
