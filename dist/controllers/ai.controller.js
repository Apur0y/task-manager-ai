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
exports.getSuggestions = exports.parseTask = void 0;
const ai_service_1 = require("../services/ai.service");
const parseTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let currentSessionId = 'session_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    try {
        const { text } = req.body;
        const aiData = yield (0, ai_service_1.chatWithAI)(text, currentSessionId);
        if (!aiData || !aiData.message) {
            return res.status(400).json({
                error: "AI failed to process the input. Please try again.",
                raw: aiData
            });
        }
        const task = aiData;
        console.log("Here is the responce", aiData);
        // const task = await Task.create(aiData);
        res.json({ success: true, task });
    }
    catch (err) {
        console.error("Parse task error:", err);
        res.status(500).json({ error: String(err) });
    }
});
exports.parseTask = parseTask;
const getSuggestions = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const suggestions = yield (0, ai_service_1.generateSuggestions)();
        res.json(suggestions);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});
exports.getSuggestions = getSuggestions;
