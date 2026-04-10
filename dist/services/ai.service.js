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
exports.generateSuggestions = exports.chatWithAI = exports.clearHistory = exports.getHistory = void 0;
const gemini_1 = require("../config/gemini");
// ─── JSON Extractor ───────────────────────────────────────────────────────────
const extractJSON = (text) => {
    try {
        const cleaned = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleaned);
    }
    catch (_a) {
        console.error("❌ JSON parse failed. Raw:", text);
        return null;
    }
};
// ─── System Prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `
You are a smart, friendly task manager assistant. Your goal is to help users add tasks, 
answer questions about task management, or just have a helpful conversation.

When a user wants to add a task:
- If you have enough info (topic/subject is enough — title is optional, you can generate one), 
  create the task immediately. Do NOT over-ask.
- If critical info is completely missing and you can't reasonably infer it, ask ONE short question.
- You can always generate a title yourself from context. Never block task creation just because 
  the user didn't explicitly provide a title.
- Be natural, warm, and concise.

You MUST always respond with ONLY a valid JSON object in one of these three shapes:

1. Ask a follow-up question:
{
  "action": "ask",
  "message": "Your friendly question here"
}

2. Create the task (you have enough info):
{
  "action": "create",
  "message": "Confirmation message, e.g. 'Got it! I've added that task for you 🎉'",
  "task": {
    "title": "Generated or provided title",
    "deadline": "YYYY-MM-DD or null",
    "priority": "low | medium | high | null",
    "description": "Optional short description or null"
  }
}

3. Just reply (not a task request — general chat, question, etc.):
{
  "action": "reply",
  "message": "Your helpful reply here"
}

Rules:
- Respond with ONLY the JSON. No markdown, no explanation outside JSON.
- Never ask more than one question at a time.
- If the user says they don't have a title or deadline, just generate/skip it — don't keep asking.
- Today's date context: ${new Date().toISOString().split("T")[0]}
`.trim();
// ─── In-Memory Session Store ──────────────────────────────────────────────────
// In production, replace with Redis or DB-backed sessions.
const sessions = new Map();
const getHistory = (sessionId) => {
    if (!sessions.has(sessionId))
        sessions.set(sessionId, []);
    return sessions.get(sessionId);
};
exports.getHistory = getHistory;
const clearHistory = (sessionId) => {
    sessions.delete(sessionId);
};
exports.clearHistory = clearHistory;
// ─── Main Chat Function ───────────────────────────────────────────────────────
const chatWithAI = (userMessage, sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const history = (0, exports.getHistory)(sessionId);
    // Append the new user message
    history.push({ role: "user", content: userMessage });
    // Build the conversation transcript for the prompt
    const transcript = history
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n");
    const fullPrompt = `${SYSTEM_PROMPT}

--- Conversation so far ---
${transcript}
--- End of conversation ---

Now respond as the Assistant:`;
    try {
        const result = yield gemini_1.model.generateContent(fullPrompt);
        const raw = result.response.text();
        const parsed = extractJSON(raw);
        if (!parsed || !parsed.action) {
            // Fallback if AI misbehaves
            const fallback = {
                action: "reply",
                message: "Sorry, I didn't quite get that. Could you rephrase?",
            };
            history.push({ role: "assistant", content: fallback.message });
            return fallback;
        }
        // Save assistant reply to history
        history.push({ role: "assistant", content: parsed.message });
        return parsed;
    }
    catch (err) {
        console.error("❌ AI call failed:", err);
        throw new Error("AI service unavailable. Please try again.");
    }
});
exports.chatWithAI = chatWithAI;
// ─── Standalone: Generate Task Suggestions ───────────────────────────────────
const generateSuggestions = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const prompt = `
Suggest 5 tasks for a full-stack developer based on latest tech trends.
Return ONLY a JSON array of strings, no markdown:
["task 1", "task 2", "task 3", "task 4", "task 5"]
`;
    const result = yield gemini_1.model.generateContent(prompt);
    const response = result.response.text();
    return (_a = extractJSON(response)) !== null && _a !== void 0 ? _a : [];
});
exports.generateSuggestions = generateSuggestions;
