import { Router } from "express";
import {
    getUserProfileController,
    onboardingController,
    userProfileController,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/onboarding", onboardingController);
router.post("/user-profile", userProfileController);
router.get("/user-profile/:clerkId", getUserProfileController);

export default router;
