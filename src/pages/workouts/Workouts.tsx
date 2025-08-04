import { PlusOutlined } from "@ant-design/icons";
import { FloatButton, Radio } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { WorkoutComponent } from "./components/workout/Workout.component";
import { useAppDispatch, type RootState } from "../../store";
import { draftActions } from "../../store/draft/draft.actions";
import { useSelector } from "react-redux";
import { draftSelectors } from "../../store/draft/draft.selectors";
import { currentActions } from "../../store/current/current.actions";
import { currentSelectors } from "../../store/current/current.selectors";

export const Workouts = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const [page, setPage] = useState<string>("current");
    const [openCreateWorkout, setOpenCreateWorkout] = useState<boolean>(false);

    const currentWorkout = useSelector((state: RootState) => currentSelectors.getCurrentWorkout(state));
    const draftWorkout = useSelector((state: RootState) => draftSelectors.getDraftWorkout(state));

    useEffect(() => {
        getCurrent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCurrent = async () => {
        await dispatch(currentActions.fetchCurrentWorkout());
    };

    const getDraft = async () => {
        await dispatch(draftActions.fetchDraftWorkout());
    };

    const openDraftWorkout = () => {
        getDraft();
        setOpenCreateWorkout(true);
    };

    return (
        <div className="w-full h-dvh md:w-3xl flex flex-col gap-2 p-4 pb-22">
            {openCreateWorkout ? (
                <WorkoutComponent workout={draftWorkout} setOpenCreateWorkout={setOpenCreateWorkout} />
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

                    {page === "current" ? (
                        <div className="mt-4">
                            <WorkoutComponent workout={currentWorkout} isReadOnly />
                        </div>
                    ) : (
                        <div>{t("workouts.history_tab_content")}</div>
                    )}

                    <FloatButton icon={<PlusOutlined />} onClick={openDraftWorkout} style={{ bottom: 80 }} />
                </>
            )}
        </div>
    );
};
