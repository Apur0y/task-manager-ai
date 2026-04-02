import { model } from "../config/gemini";


// 🧠 Helper: Clean JSON safely
const extractJSON = (text: string) => {
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("JSON parse error:", text);
    return {};
  }
};

// ✅ Parse Task
export const parseTaskWithAI = async (text: string) => {
  const prompt = `
Extract task details from this text:
"${text}"

Return ONLY JSON:
{
  "title": "",
  "deadline": "",
  "priority": "low | medium | high"
}
`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  return extractJSON(response);
};

// ✅ Generate Suggestions
export const generateSuggestions = async () => {
  const prompt = `
Suggest 5 tasks for a full-stack developer based on latest tech trends.

Return ONLY JSON array like:
[
  "task 1",
  "task 2"
]
`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  return extractJSON(response);
};