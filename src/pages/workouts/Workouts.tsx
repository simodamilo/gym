import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { PageSwitcher } from "../../components/pageSwitcher/PageSwitcher";
import { useSelector } from "react-redux";
import { currentSelectors } from "../../store/current/current.selectors";
import type { RootState } from "../../store";
import { routes } from "../../utils/routing/routes";
import { useTheme } from "../../theme/ThemeProvider";

export const Workouts = () => {
    const navigate = useNavigate();
    const { mode, toggleTheme } = useTheme();

    const [page, setPage] = useState<string>("current");

    const showSwitcher = useSelector((state: RootState) => currentSelectors.showSwitcher(state));

    useEffect(() => {
        navigate(page === "current" ? routes.workoutsCurrent : routes.workoutsHistory);
    }, [page, navigate]);

    return (
        <div
            className="w-full md:max-w-[1200px] h-full flex flex-col m-auto overflow-hidden"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
            {/* Container with max width for desktop */}
            {showSwitcher &&
                <div className="w-full flex flex-col px-4 md:px-4 py-6 md:py-8 overflow-hidden max-w-7xl mx-auto">
                    {/* Header with title and dark mode toggle */}
                    <div className="flex items-center justify-between mb-6">
                        <h1
                            className="text-3xl font-bold m-0"
                            style={{ color: "var(--text-primary)" }}
                        >
                            Workouts
                        </h1>
                        <motion.button
                            onClick={toggleTheme}
                            className="w-10 h-10 rounded-full flex items-center justify-center border cursor-pointer shadow-var-sm"
                            style={{
                                backgroundColor: "var(--bg-elevated)",
                                borderColor: "var(--border-default)",
                                color: "var(--text-primary)",
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            {mode === "dark" ? (
                                <SunOutlined style={{ fontSize: "18px" }} />
                            ) : (
                                <MoonOutlined style={{ fontSize: "18px" }} />
                            )}
                        </motion.button>
                    </div>

                    <PageSwitcher active={page} onChange={(key) => setPage(key)} />
                </div>
            }
            <div className="flex-1 px-4 overflow-auto md:pb-8 hide-scrollbar relative">
                <Outlet />
            </div>
        </div>
    );
};
