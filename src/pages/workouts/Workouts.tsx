import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { PageSwitcher } from "../../components/pageSwitcher/PageSwitcher";
import { useSelector } from "react-redux";
import { currentSelectors } from "../../store/current/current.selectors";
import type { RootState } from "../../store";
import { routes } from "../../utils/routing/routes";

export const Workouts = () => {
    const navigate = useNavigate();

    const [page, setPage] = useState<string>("current");

    const showSwitcher = useSelector((state: RootState) => currentSelectors.showSwitcher(state));

    useEffect(() => {
        navigate(page === "current" ? routes.workoutsCurrent : routes.workoutsHistory);
    }, [page, navigate]);

    return (
        <div className="w-full md:max-w-[1200px] h-full flex flex-col m-auto mt-4 overflow-hidden bg-[var(--bg-secondary)]">
            {/* Header with title and dark mode toggle */}
            <div className="flex items-center justify-between px-4">
                <h1 className="text-3xl font-bold m-0 text-[var(--text-primary)]">Workouts</h1>
            </div>

            {/* Container with max width for desktop */}
            {showSwitcher && (
                <div className="w-full flex flex-col px-4 md:px-4 py-4 overflow-hidden max-w-7xl mx-auto">
                    <PageSwitcher active={page} onChange={(key) => setPage(key)} />
                </div>
            )}
            <div className="flex-1 px-4 overflow-auto md:pb-8 hide-scrollbar relative">
                <Outlet />
            </div>
        </div>
    );
};
