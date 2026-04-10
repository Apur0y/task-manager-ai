"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = require("../controllers/ai.controller");
const router = (0, express_1.Router)();
router.post("/parse-task", ai_controller_1.parseTask);
router.get("/suggestions", ai_controller_1.getSuggestions);
exports.default = router;
