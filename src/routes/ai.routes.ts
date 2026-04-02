import { Router } from "express";
import { parseTask, getSuggestions } from "../controllers/ai.controller";

const router = Router();

router.post("/parse-task", parseTask);
router.get("/suggestions", getSuggestions);

export default router;
