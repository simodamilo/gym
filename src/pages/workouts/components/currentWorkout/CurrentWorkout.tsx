import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "../../../../store";
import { currentSelectors } from "../../../../store/current/current.selectors";
import { useEffect, useState } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { currentActions } from "../../../../store/current/current.actions";
import { Skeleton } from "antd";

export const CurrentWorkout = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [openExercisesId, setOpenExercisesId] = useState<number>();

    const currentWorkout = useSelector((state: RootState) => currentSelectors.getCurrentWorkout(state));
    const isLoadingWorkout = useSelector((state: RootState) => currentSelectors.isLoading(state));

    useEffect(() => {
        getCurrent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCurrent = async () => {
        await dispatch(currentActions.fetchCurrentWorkout());
    };

    if (isLoadingWorkout) {
        return (
            <div className="mt-4">
                <Skeleton active />
            </div>
        );
    }

    return (
        <div>
            <div className="w-full h-full max-h-full md:w-3xl flex flex-col justify-between gap-4">
                {openExercisesId ? (
                    <div>TEST</div>
                ) : (
                    <>
                        {currentWorkout && currentWorkout.days && currentWorkout.days.length > 0 ? (
                            <div className="flex-1 overflow-y-auto flex flex-col gap-2 mt-4">
                                {currentWorkout.days.map((day, index) => {
                                    return (
                                        <div key={index} className="p-3 border border-[#FFEAD8] shadow-md rounded-xl flex items-center justify-between">
                                            <p>{day.name}</p>
                                            <div>
                                                <ArrowRightOutlined onClick={() => setOpenExercisesId(day.id)} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div>{t("workouts.create_workout.no_draft")}</div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
