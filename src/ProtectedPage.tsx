import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./utils/AuthProvider";

const ProtectedPage = () => {
    const { user } = useAuth();
    console.log("user at ProtectedPage: ", user);

    if (!user) {
        return <Navigate to="/gym/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedPage;
