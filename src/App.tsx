import "./utils/i18n/i18n";
import { NotificationProvider } from "./components/notificationProvider/NotificationProvider";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./utils/auth/AuthProvider";
import { BottomBar } from "./components/bottomBar/BottomBar";
import { supabase } from "./store/supabaseClient";

function App() {
    const { user } = useAuth();

    useEffect(() => {
        const init = async () => {
            // Subscribe to auth changes
            const {
                data: { subscription },
            } = supabase.auth.onAuthStateChange((event, session) => {
                console.log("session onAuthStateChange:", event, session);

                if (event === "PASSWORD_RECOVERY") {
                    // 👇 handle navigation safely (either with Router or simple reload)
                    window.location.href = "/reset-password";
                }
            });

            return () => subscription.unsubscribe();
        };

        init();
    }, []);

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
            <div className="w-screen h-dvh flex flex-col">
                {user && <BottomBar />}
                <Outlet />
            </div>
        </NotificationProvider>
    );
}

export default App;
