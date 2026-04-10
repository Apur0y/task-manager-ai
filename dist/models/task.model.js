"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
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
    resources: {
        type: [
            new mongoose_1.default.Schema({
                label: { type: String, required: true },
                url: { type: String, required: true },
            })
        ],
        default: [],
    },
    isCarriedOver: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
taskSchema.index({ date: 1, category: 1 });
taskSchema.index({ date: 1, status: 1 });
exports.Task = mongoose_1.default.model("Task", taskSchema);
