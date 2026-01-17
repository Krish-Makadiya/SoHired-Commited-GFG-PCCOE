import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import Loader from "../main/Loader"; // Assuming Loader is in the same path as in ProtectedRoute

const RoleProtected = ({ children, allowedRole }) => {
    const { isLoaded, isSignedIn, user } = useUser();

    if (!isLoaded) {
        return <Loader />;
    }

    if (!isSignedIn) {
        return <Navigate to="/" replace />;
    }

    const userRole = user?.unsafeMetadata?.role || 'Candidate'; // Default to Candidate

    if (userRole !== allowedRole) {
        // Redirect logic based on role mismatch
        // If a Candidate tries to access recruiter pages -> goes to main dashboard (which renders Candidate dash)
        // If a recruiter tries to access Candidate pages -> goes to main dashboard (which renders recruiter dash)
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default RoleProtected;
