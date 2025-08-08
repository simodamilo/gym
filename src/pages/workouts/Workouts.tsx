import { PlusOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { WorkoutComponent } from "./components/workout/Workout.component";
import { useNavigate } from "react-router-dom";
import { PageSwitcher } from "../../components/pageSwitcher/PageSwitcher";
import { useSelector } from "react-redux";
import { currentSelectors } from "../../store/current/current.selectors";
import type { RootState } from "../../store";

export const Workouts = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [page, setPage] = useState<string>("current");

    const showSwitcher = useSelector((state: RootState) => currentSelectors.showSwitcher(state));

    return (
        <div className="w-full h-dvh md:w-3xl flex flex-col gap-2">
            {showSwitcher && <PageSwitcher active={page} onChange={(key) => setPage(key)} />}

            <>{page === "current" ? <WorkoutComponent isReadOnly /> : <div>{t("workouts.history_tab_content")}</div>}</>

            {showSwitcher && <FloatButton icon={<PlusOutlined />} onClick={() => navigate("/gym/workouts/create")} style={{ bottom: 100 }} />}
        </div>
    );
};
