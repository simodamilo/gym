import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageSwitcher } from "../../components/pageSwitcher/PageSwitcher";
import { useSelector } from "react-redux";
import { currentSelectors } from "../../store/current/current.selectors";
import type { RootState } from "../../store";
import { routes } from "../../utils/routing/routes";

export const Workouts = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const [page, setPage] = useState<string>("current");

    const showSwitcher = useSelector((state: RootState) => currentSelectors.showSwitcher(state));

    // Sync page state with current route
    useEffect(() => {
        if (location.pathname.includes('/history')) {
            setPage("history");
        } else if (location.pathname.includes('/current')) {
            setPage("current");
        }
    }, [location.pathname]);

    useEffect(() => {
        navigate(page === "current" ? routes.workoutsCurrent : routes.workoutsHistory);
    }, [page, navigate]);

    return (
        <div className="w-full md:max-w-[1200px] h-full flex flex-col m-auto mt-4 overflow-hidden bg-[var(--bg-secondary)]">
            {/* Header with title and dark mode toggle */}
            <div className="flex items-center justify-between px-4">
                <h1 className="text-3xl font-bold m-0 text-[var(--text-primary)]">{t('pages.workouts.title')}</h1>
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
