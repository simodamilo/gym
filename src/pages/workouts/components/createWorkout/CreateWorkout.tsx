import { ArrowRightOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, type RootState } from "../../../../store";
import { useSelector } from "react-redux";
import { Button, Input, Skeleton } from "antd";
import { Exercises } from "../exercises/Exercises";
import { draftActions } from "../../../../store/draft/draft.actions";
import type { Day } from "../../../../store/draft/types";
import { draftSelectors } from "../../../../store/draft/draft.selectors";

interface CreateWorkoutProps {
    setOpenCreateWorkout: (open: boolean) => void;
}

export const CreateWorkout = (props: CreateWorkoutProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [days, setDays] = useState<Day[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [openExercisesId, setOpenExercisesId] = useState<number>();

    const draftWorkout = useSelector((state: RootState) => draftSelectors.getDraftWorkout(state));
    const isLoadingWorkout = useSelector((state: RootState) => draftSelectors.isLoadingWorkout(state));
    const isLoadingDays = useSelector((state: RootState) => draftSelectors.isLoadingDays(state));

    useEffect(() => {
        if (draftWorkout) {
            setDays(draftWorkout.days);
        }
    }, [dispatch, draftWorkout]);

    useEffect(() => {
        getDraft();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getDraft = async () => {
        await dispatch(draftActions.fetchDraftWorkout());
    };

    const handleAddDay = () => {
        setDays((prevDays) => [
            ...prevDays,
            {
                id: prevDays.length + 1,
                name: "",
                exercises: [],
                day_exercises: [],
            },
        ]);

        setTimeout(() => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo({
                    top: scrollContainerRef.current.scrollHeight,
                    behavior: "smooth",
                });
            }
        }, 0);
    };

    const handleChangeDayName = (dayId: number, name: string) => {
        setDays((prevDays) =>
            prevDays.map((day) => {
                if (day.id === dayId) {
                    return { ...day, name };
                }
                return day;
            })
        );
    };

    const saveDay = (dayId: number) => {
        const day = days.find((d) => d.id === dayId);
        if (!day) return;

        dispatch(
            draftActions.upsertDay({
                id: day?.id,
                name: day?.name || "",
                created_at: new Date().getMilliseconds(),
                workout_id: draftWorkout?.id,
            })
        );
    };

    const handleDeleteDay = (dayId: number) => {
        dispatch(draftActions.deleteDay(dayId));
    };

    if (isLoadingWorkout) {
        return <Skeleton />;
    }

    return (
        <div className="w-full h-screen max-h-full md:w-3xl flex flex-col justify-between gap-4">
            {openExercisesId ? (
                <Exercises dayId={openExercisesId} setOpenExercisesId={setOpenExercisesId} />
            ) : (
                <>
                    <div className="flex justify-end w-full">
                        <CloseOutlined onClick={() => props.setOpenCreateWorkout(false)} />
                    </div>
                    {days && days.length > 0 ? (
                        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto flex flex-col gap-2">
                            {days.map((day, index) => {
                                return (
                                    <div key={index} className="p-3 border rounded-xl">
                                        <Input
                                            size="small"
                                            placeholder={t("workouts.create_workout.day_name_placeholder")}
                                            value={day.name}
                                            onChange={(input) => handleChangeDayName(day.id, input.target.value)}
                                            disabled={isLoadingDays}
                                            onBlur={() => saveDay(day.id)}
                                        />
                                        <div className="flex justify-between items-center mt-4">
                                            <DeleteOutlined onClick={() => handleDeleteDay(day.id)} />
                                            <ArrowRightOutlined onClick={() => setOpenExercisesId(day.id)} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div>No Draft available</div>
                    )}
                    <div className="sticky bottom-0 flex flex-col gap-2">
                        <Button type="default" block onClick={handleAddDay}>
                            {t("workouts.create_workout.add_day_btn")}
                        </Button>
                        <Button type="primary" block>
                            {t("workouts.create_workout.publish_btn")}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};
