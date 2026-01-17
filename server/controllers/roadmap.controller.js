import { db } from "../config/firebase.js";

export const getRoadmaps = async (req, res) => {
    try {
        const { clerkId } = req.params;

        if (!clerkId) {
            return res.status(400).json({ message: "Clerk ID is required" });
        }

        const snapshot = await db
            .collection("users")
            .doc(clerkId)
            .collection("roadmaps")
            .get();

        const roadmaps = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(roadmaps);
    } catch (error) {
        console.error("Error fetching roadmaps:", error);
        res.status(500).json({ message: "Failed to fetch roadmaps" });
    }
};

export const getRoadmapById = async (req, res) => {
    try {
        const { clerkId, roadmapId } = req.params;

        if (!clerkId || !roadmapId) {
            return res
                .status(400)
                .json({ message: "Clerk ID and Roadmap ID are required" });
        }

        const doc = await db
            .collection("users")
            .doc(clerkId)
            .collection("roadmaps")
            .doc(roadmapId)
            .get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Roadmap not found" });
        }

        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error("Error fetching roadmap:", error);
        res.status(500).json({ message: "Failed to fetch roadmap" });
    }
};

export const updateRoadmapProgress = async (req, res) => {
    try {
        const { clerkId, roadmapId } = req.params;
        const { stepIndex, status, score } = req.body;

        if (!clerkId || !roadmapId || stepIndex === undefined || !status) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const roadmapRef = db
            .collection("users")
            .doc(clerkId)
            .collection("roadmaps")
            .doc(roadmapId);

        const doc = await roadmapRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: "Roadmap not found" });
        }

        const roadmapData = doc.data();
        const steps = roadmapData.steps || [];

        if (stepIndex < 0 || stepIndex >= steps.length) {
            return res.status(400).json({ message: "Invalid step index" });
        }

        // Update current step
        steps[stepIndex] = {
            ...steps[stepIndex],
            status: status, // Expected: "Completed"
            quizScore: score,
        };

        // Unlock next step if completed (check both cases just to be safe, but we prefer Title Case)
        const isCompleted = status === "Completed" || status === "completed";

        if (isCompleted && stepIndex + 1 < steps.length) {
            steps[stepIndex + 1] = {
                ...steps[stepIndex + 1],
                status: "In Progress", // Unlock next step with Title Case to match frontend expectations
            };
        }

        await roadmapRef.update({ steps });

        res.status(200).json({ message: "Roadmap progress updated", steps });
    } catch (error) {
        console.error("Error updating roadmap progress:", error);
        res.status(500).json({ message: "Failed to update progress" });
    }
};
