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
        <div
            className="w-full h-full flex flex-col overflow-hidden"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
            {/* Container with max width for desktop */}
            <div className="w-full h-full flex flex-col px-4 md:px-8 py-6 md:py-8 overflow-hidden max-w-7xl mx-auto">
                {showSwitcher && <PageSwitcher active={page} onChange={(key) => setPage(key)} />}

                <div className="flex-1 overflow-auto pb-24 md:pb-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
