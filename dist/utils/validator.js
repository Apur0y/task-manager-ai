"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTask = void 0;
const validateTask = (task) => {
    return task.title && task.priority;
};
exports.validateTask = validateTask;
