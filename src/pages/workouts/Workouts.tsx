import { PlusOutlined } from "@ant-design/icons";
import { FloatButton, Radio } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateWorkout } from "./components/createWorkout/CreateWorkout";

export const Workouts = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState<string>("current");
    const [openCreateWorkout, setOpenCreateWorkout] = useState<boolean>(false);

    return (
        <div className="w-full h-screen md:w-3xl flex flex-col gap-2 p-4 pb-22">
            {openCreateWorkout ? (
                <CreateWorkout setOpenCreateWorkout={setOpenCreateWorkout} />
            ) : (
                <>
                    <Radio.Group value={page} onChange={(e) => setPage(e.target.value)}>
                        <Radio.Button value="current" className="w-1/2">
                            {t("workouts.current_tab")}
                        </Radio.Button>
                        <Radio.Button value="history" className="w-1/2">
                            {t("workouts.history_tab")}
                        </Radio.Button>
                    </Radio.Group>

                    <FloatButton icon={<PlusOutlined />} onClick={() => setOpenCreateWorkout(true)} style={{ bottom: 80 }} />
                </>
            )}
        </div>
    );
};
