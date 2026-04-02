import { Request, Response } from "express";
import { parseTaskWithAI, generateSuggestions } from "../services/ai.service";
import { Task } from "../models/task.model";

export const parseTask = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const aiData = await parseTaskWithAI(text);
    const task = await Task.create(aiData);
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ error: err });
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
