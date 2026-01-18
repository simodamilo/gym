import "./utils/i18n/i18n";
import { NotificationProvider } from "./components/notificationProvider/NotificationProvider";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./utils/auth/AuthProvider";
import { BottomBar } from "./components/bottomBar/BottomBar";
import { DesktopNav } from "./components/navigation/DesktopNav";

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
            <div className="w-screen h-dvh flex bg-bg-secondary">
                {/* Desktop Navigation - hidden on mobile */}
                {user && <DesktopNav />}

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Outlet />
                </div>

                {/* Mobile Bottom Navigation - hidden on desktop */}
                {user && <BottomBar />}
            </div>
        </NotificationProvider>
    );
}

export default App;
