"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api/ai", ai_routes_1.default);
app.use("/api/tasks", task_routes_1.default);
// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "Server is running", timestamp: new Date() });
});
app.get("/", (req, res) => {
    res.json({ status: "Server is running", timestamp: new Date() });
});
exports.default = app;
