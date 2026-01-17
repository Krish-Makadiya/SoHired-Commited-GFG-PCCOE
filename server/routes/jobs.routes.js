import { Router } from "express";
import {
    getAllJobs,
    saveJobController,
    getSavedJobs,
    getPassedJobs,
    batchJobActions,
} from "../controllers/jobs.controller.js";

const router = Router();

router.get("/:clerkId", getAllJobs);

router.post("/save-job/:clerkId", saveJobController);
router.post("/batch-actions/:clerkId", batchJobActions);
router.get("/saved-jobs/:clerkId", getSavedJobs);
router.get("/passed-jobs/:clerkId", getPassedJobs);

export default router;
