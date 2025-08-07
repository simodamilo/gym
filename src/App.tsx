import "./App.css";
import "./utils/i18n/i18n";
import { Navbar } from "./components/navbar/Navbar";
import { NotificationProvider } from "./components/notificationProvider/NotificationProvider";
import { useAuth } from "./utils/AuthProvider";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";

function App() {
    const { user } = useAuth();

    useEffect(() => {
        const splash = document.getElementById("splash-screen");
        if (splash) {
            splash.style.opacity = "0";
            splash.style.transition = "opacity 0.5s ease-out";

            setTimeout(() => {
                splash.remove();
            }, 500);
        }
    }, []);

    return (
        <NotificationProvider>
            <div className="w-screen h-dvh flex flex-col p-4">
                {user && <Navbar />}
                <Outlet />
            </div>
        </NotificationProvider>
    );
}

export default App;
