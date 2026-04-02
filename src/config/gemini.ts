import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);
console.log("Gemini AI initialized successfully");

// Choose model
export const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", // fast + cheap
});