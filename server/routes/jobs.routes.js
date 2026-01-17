import { Router } from "express";
import {
    getAllJobs,
    saveJobController,
    getSavedJobs,
    getPassedJobs,
    batchJobActions,
    postJobController,
    getRecruiterJobs,
    updateJobController,
} from "../controllers/jobs.controller.js";

const router = Router();

router.post("/post", postJobController);
router.post("/update", updateJobController);
router.get("/posted/:recruiterId", getRecruiterJobs);
router.get("/posted/:recruiterId", getRecruiterJobs);
router.get("/:clerkId", getAllJobs);

router.post("/save-job/:clerkId", saveJobController);
router.post("/batch-actions/:clerkId", batchJobActions);
router.get("/saved-jobs/:clerkId", getSavedJobs);
router.get("/passed-jobs/:clerkId", getPassedJobs);

export default router;
