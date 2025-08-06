import "./App.css";
import { Provider } from "react-redux";
import store from "./store/store.config";
import "./utils/i18n/i18n";
import { Navbar } from "./components/navbar/Navbar";
import { NotificationProvider } from "./components/notificationProvider/NotificationProvider";
import { useAuth } from "./utils/AuthProvider";
import { Outlet } from "react-router-dom";

function App() {
    const { user } = useAuth();

    return (
        <NotificationProvider>
            <Provider store={store}>
                <div className="w-screen h-dvh flex flex-col p-4">
                    {user && <Navbar />}
                    <Outlet />
                </div>
            </Provider>
        </NotificationProvider>
    );
}

export default App;
