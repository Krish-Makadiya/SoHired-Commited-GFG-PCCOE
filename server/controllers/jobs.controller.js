import { db } from "../config/firebase.js";

export const getAllJobs = async (req, res) => {
    try {
        const { clerkId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const countSnapshot = await db
            .collection("users")
            .doc(clerkId)
            .collection("job")
            .count()
            .get();
        const totalJobs = countSnapshot.data().count;

        const snapshot = await db
            .collection("users")
            .doc(clerkId)
            .collection("job")
            .orderBy("updatedAt", "desc")
            .limit(limit)
            .offset(offset)
            .get();

        const jobs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json({
            jobs,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalJobs / limit),
                totalJobs,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const saveJobController = async (req, res) => {
    try {
        const { clerkId } = req.params;
        let jobId = req.body.jobId || req.body.id;

        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required" });
        }

        jobId = String(jobId);
        // In case the frontend sends more job details, we can spread them.
        // For now, we'll store the jobId and the timestamp.
        const jobData = {
            jobId,
            savedAt: new Date().toISOString(),
            ...req.body, // include other properties if sent
        };

        // Reference the specific job document in the 'saved_jobs' subcollection
        // Using set() with merge: true prevents overwriting if we just want to update,
        // but also creates if it doesn't exist. Using jobId as doc ID avoids duplicates directly.
        await db
            .collection("users")
            .doc(clerkId)
            .collection("saved_jobs")
            .doc(jobId)
            .set(jobData, { merge: true });

        // Remove from the main 'job' subcollection so it doesn't show up again
        await db
            .collection("users")
            .doc(clerkId)
            .collection("job")
            .doc(jobId)
            .delete();

        return res.status(200).json({ message: "Job saved successfully" });
    } catch (error) {
        console.error("Error saving job:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getSavedJobs = async (req, res) => {
    try {
        const { clerkId } = req.params;
        const snapshot = await db
            .collection("users")
            .doc(clerkId)
            .collection("saved_jobs")
            .orderBy("savedAt", "desc")
            .get();

        const savedJobs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(savedJobs);
    } catch (error) {
        console.error("Error fetching saved jobs:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getPassedJobs = async (req, res) => {
    try {
        const { clerkId } = req.params;
        const snapshot = await db
            .collection("users")
            .doc(clerkId)
            .collection("passed_jobs")
            .orderBy("passedAt", "desc")
            .get();

        const passedJobs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(passedJobs);
    } catch (error) {
        console.error("Error fetching passed jobs:", error);
        res.status(500).json({ message: error.message });
    }
};

export const batchJobActions = async (req, res) => {
    try {
        const { clerkId } = req.params;
        const { actions } = req.body; // Array of { jobId, action, jobData }

        if (!Array.isArray(actions) || actions.length === 0) {
            return res.status(200).json({ message: "No actions to process" });
        }

        const batch = db.batch();
        const userRef = db.collection("users").doc(clerkId);

        actions.forEach((item) => {
            const { jobId, action, jobData } = item;
            if (!jobId) return;

            // Define references
            const mainJobRef = userRef.collection("job").doc(jobId);

            if (action === "save") {
                const docRef = userRef.collection("saved_jobs").doc(jobId);
                const data = {
                    jobId,
                    savedAt: new Date().toISOString(),
                    ...jobData,
                };
                batch.set(docRef, data, { merge: true });
            } else if (action === "pass") {
                const docRef = userRef.collection("passed_jobs").doc(jobId);
                const data = {
                    jobId,
                    passedAt: new Date().toISOString(),
                    ...jobData, // Optional: store job data for passed jobs too
                };
                batch.set(docRef, data, { merge: true });
            }

            // Remove from the main 'jobs' subcollection so it doesn't show up again
            batch.delete(mainJobRef);
        });

        await batch.commit();

        res.status(200).json({ message: "Batch actions processing completed" });
    } catch (error) {
        console.error("Error processing batch actions:", error);
        res.status(500).json({ message: error.message });
    }
};
