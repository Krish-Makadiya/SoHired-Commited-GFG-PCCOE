import { Router } from "express";
import {
    getRoadmaps,
    getRoadmapById,
    updateRoadmapProgress,
} from "../controllers/roadmap.controller.js";

const router = Router();

router.get("/:clerkId", getRoadmaps);
router.get("/:clerkId/:roadmapId", getRoadmapById);
router.put("/:clerkId/:roadmapId/progress", updateRoadmapProgress);

export default router;
