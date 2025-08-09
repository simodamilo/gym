import { PlusOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
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
        <div className="w-full h-dvh md:w-3xl flex flex-col gap-2">
            {showSwitcher && <PageSwitcher active={page} onChange={(key) => setPage(key)} />}

            <Outlet />

            {showSwitcher && <FloatButton icon={<PlusOutlined />} onClick={() => navigate(routes.workoutsCreate)} style={{ bottom: 100 }} />}
        </div>
    );
};
