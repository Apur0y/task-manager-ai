import { Request, Response } from "express";
import { chatWithAI, generateSuggestions } from "../services/ai.service";
import { Task } from "../models/task.model";

export const parseTask = async (req: Request, res: Response) => {
  let currentSessionId = 'session_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  try {
    const { text } = req.body;
    const aiData = await chatWithAI(text,currentSessionId);
    
    if (!aiData || !aiData.message) {
      return res.status(400).json({ 
        error: "AI failed to process the input. Please try again.",
        raw: aiData 
      });
    }
    
    const task =aiData;
    console.log("Here is the responce",aiData);
    // const task = await Task.create(aiData);
    res.json({ success: true, task });
  } catch (err) {
    console.error("Parse task error:", err);
    res.status(500).json({ error: String(err) });
  }
};

export const getSuggestions = async (_req: Request, res: Response) => {
  try {
    const suggestions = await generateSuggestions();
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
