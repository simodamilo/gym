import { PlusOutlined } from "@ant-design/icons";
import { FloatButton, Radio } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { WorkoutComponent } from "./components/workout/Workout.component";
import { useNavigate } from "react-router-dom";

export const Workouts = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [page, setPage] = useState<string>("current");

    return (
        <div className="w-full h-dvh md:w-3xl flex flex-col gap-2">
            <Radio.Group value={page} onChange={(e) => setPage(e.target.value)}>
                <Radio.Button value="current" className="w-1/2">
                    {t("workouts.current_tab")}
                </Radio.Button>
                <Radio.Button value="history" className="w-1/2">
                    {t("workouts.history_tab")}
                </Radio.Button>
            </Radio.Group>

            <>
                {page === "current" ? (
                    <div className="mt-4">
                        <WorkoutComponent isReadOnly />
                    </div>
                ) : (
                    <div>{t("workouts.history_tab_content")}</div>
                )}
            </>

            <FloatButton icon={<PlusOutlined />} onClick={() => navigate("/gym/workouts/create")} style={{ bottom: 80 }} />
        </div>
    );
};
