import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Profile } from "./pages/profile/Profile";
import { Exercises } from "./pages/exercises/Exercises";
import { Provider } from "react-redux";
import store from "./store/store.config";
import "./utils/i18n/i18n";
import { Navbar } from "./components/navbar/Navbar";
import { Workouts } from "./pages/workouts/Workouts";
import { NotificationProvider } from "./components/notificationProvider/NotificationProvider";

function App() {
    return (
        <NotificationProvider>
            <Provider store={store}>
                <div className="w-full h-full flex flex-col items-center">
                    <Navbar />
                    <Routes>
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/workouts" element={<Workouts />} />
                        <Route path="/exercises" element={<Exercises />} />
                    </Routes>
                </div>
            </Provider>
        </NotificationProvider>
    );
}

export default App;
