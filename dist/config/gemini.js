"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.model = void 0;
const generative_ai_1 = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
}
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
console.log("Gemini AI initialized successfully");
// Choose model
exports.model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash", // fast + cheap
});
