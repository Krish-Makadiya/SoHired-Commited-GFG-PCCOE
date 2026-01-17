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

export const postJobController = async (req, res) => {
    try {
        const jobData = req.body;
        const { recruiterId, title, description, status } = jobData;

        if (!recruiterId || !title || !description) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Add server-side timestamp just in case
        const dataToSave = {
            ...jobData,
            postedAt: jobData.postedAt || new Date().toISOString(),
            createdAt: new Date().toISOString(),
            status: status || "Active", // Default to Active if not provided
            applicantCount: 0,
            applicants: [],
        };

        const docRef = await db.collection("jobs").add(dataToSave);

        res.status(201).json({
            message: "Job posted successfully",
            jobId: docRef.id,
        });
    } catch (error) {
        console.error("Error posting job:", error);
        res.status(500).json({
            message: "Failed to post job",
            error: error.message,
        });
    }
};

export const getRecruiterJobs = async (req, res) => {
    try {
        const { recruiterId } = req.params;
        console.log(recruiterId);
        if (!recruiterId) {
            return res
                .status(400)
                .json({ message: "Recruiter ID is required" });
        }

        const snapshot = await db
            .collection("jobs")
            .where("recruiterId", "==", recruiterId)
            // .orderBy("createdAt", "desc") // Requires index, doing in-memory sort for now
            .get();

        const jobs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // In-memory sort
        jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json(jobs);
    } catch (error) {
        console.error("Error fetching recruiter jobs:", error);
        res.status(500).json({
            message: "Failed to fetch jobs",
            error: error.message,
        });
    }
};

export const updateJobController = async (req, res) => {
    try {
        const { jobId, ...jobData } = req.body;

        if (!jobId) {
            return res
                .status(400)
                .json({ message: "Job ID is required for update" });
        }

        // Add server-side timestamp for update
        const dataToUpdate = {
            ...jobData,
            updatedAt: new Date().toISOString(),
        };

        await db.collection("jobs").doc(jobId).update(dataToUpdate);

        res.status(200).json({
            message: "Job updated successfully",
            jobId: jobId,
        });
    } catch (error) {
        console.error("Error updating job:", error);
        res.status(500).json({
            message: "Failed to update job",
            error: error.message,
        });
    }
};
