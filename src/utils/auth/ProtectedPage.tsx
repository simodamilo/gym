import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedPage = () => {
    const { user, loading } = useAuth();
    console.log("user at ProtectedPage: ", user);
    console.log("loading at ProtectedPage: ", loading);

    // Wait for auth to finish loading before checking user
    if (loading) {
        return null; // or return a loading spinner
    }

    if (!user) {
        return <Navigate to="/gym/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedPage;
