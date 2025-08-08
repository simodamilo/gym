import { PlusOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { WorkoutComponent } from "./components/workout/Workout.component";
import { useNavigate } from "react-router-dom";
import { PageSwitcher } from "../../components/pageSwitcher/PageSwitcher";

export const Workouts = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [page, setPage] = useState<string>("current");

    return (
        <div className="w-full h-dvh md:w-3xl flex flex-col gap-2">
            <PageSwitcher active={page} onChange={(key) => setPage(key)} />

            <>
                {page === "current" ? (
                    <div className="mt-4">
                        <WorkoutComponent isReadOnly />
                    </div>
                ) : (
                    <div>{t("workouts.history_tab_content")}</div>
                )}
            </>

            <FloatButton icon={<PlusOutlined />} onClick={() => navigate("/gym/workouts/create")} style={{ bottom: 100 }} />
        </div>
    );
};
