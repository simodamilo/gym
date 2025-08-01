import { ArrowRightOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, type RootState } from "../../../../store";
import { Button, Input, Skeleton } from "antd";
import { ExercisesList } from "../exercisesList/ExercisesList";
import { draftActions } from "../../../../store/draft/draft.actions";
import type { Day, Workout } from "../../../../store/draft/types";
import { useSelector } from "react-redux";
import { draftSelectors } from "../../../../store/draft/draft.selectors";
import { v4 as uuidv4 } from "uuid";

interface WorkoutProps {
    workout?: Workout;
    isReadOnly?: boolean;
    setOpenCreateWorkout?: (open: boolean) => void;
}

export const WorkoutComponent = (props: WorkoutProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [openExercisesId, setOpenExercisesId] = useState<string>();
    const [workout, setWorkout] = useState<Workout>();
    const [days, setDays] = useState<Day[]>([]);

    const isLoadingWorkout = useSelector((state: RootState) => draftSelectors.isLoadingWorkout(state));

    useEffect(() => {
        if (props.workout) {
            setWorkout(props.workout);
            setDays(props.workout.days);
        }
    }, [props.workout]);

    /* only used if isReadOnly is false */
    const handleAddDay = () => {
        setDays((prevDays) => [
            ...prevDays,
            {
                id: uuidv4(),
                name: "",
                dayExercises: [],
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

    /* only used if isReadOnly is false */
    const handleChangeDayName = (dayId: string, name: string) => {
        setDays((prevDays) =>
            prevDays.map((day) => {
                if (day.id === dayId) {
                    return { ...day, name };
                }
                return day;
            })
        );
    };

    /* only used if isReadOnly is false */
    const saveDay = (dayId: string) => {
        const day = days.find((d) => d.id === dayId);
        if (!day) return;

        dispatch(
            draftActions.upsertDay({
                id: uuidv4(),
                name: day?.name || "",
                workout_id: workout!.id,
            })
        );
    };

    /* only used if isReadOnly is false */
    const handleDeleteDay = (dayId: string) => {
        dispatch(draftActions.deleteDay(dayId));
    };

    /* only used if isReadOnly is false */
    const publishWorkout = () => {
        dispatch(draftActions.publishDraftWorkout());
        if (props.setOpenCreateWorkout) {
            props.setOpenCreateWorkout(false);
        }
    };

    if (isLoadingWorkout && !workout) {
        return <Skeleton active />;
    }

    return (
        <div className={`w-full h-full max-h-full md:w-3xl flex flex-col ${props.isReadOnly ? "justify-around" : "justify-between"} gap-4`}>
            {openExercisesId ? (
                <ExercisesList
                    workoutId={props.workout!.id}
                    dayId={openExercisesId}
                    dayExercises={workout?.days.find((day: Day) => day.id === openExercisesId)?.dayExercises ?? []}
                    isReadOnly={props.isReadOnly}
                    setOpenExercisesId={setOpenExercisesId}
                />
            ) : (
                <>
                    {!props.isReadOnly && props.setOpenCreateWorkout && (
                        <div className="flex justify-end w-full">
                            <CloseOutlined onClick={() => props.setOpenCreateWorkout?.(false)} />
                        </div>
                    )}
                    {days && days.length > 0 ? (
                        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto flex flex-col gap-2">
                            {days.map((day, index) => {
                                return props.isReadOnly ? (
                                    <div key={index} className="p-3 border border-[#FFEAD8] shadow-md rounded-xl flex items-center justify-between">
                                        <p>{day.name}</p>
                                        <div>
                                            <ArrowRightOutlined onClick={() => setOpenExercisesId(day.id)} />
                                        </div>
                                    </div>
                                ) : (
                                    <div key={index} className="p-3 border border-[#FFEAD8] shadow-md rounded-xl">
                                        <Input
                                            placeholder={t("workouts.workout.day_name_placeholder")}
                                            value={day.name}
                                            onChange={(input) => handleChangeDayName(day.id, input.target.value)}
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
                        <div>{t("workouts.workout.no_workout")}</div>
                    )}
                    {!props.isReadOnly && (
                        <div className="sticky bottom-0 flex flex-col gap-2">
                            <Button type="default" block onClick={handleAddDay}>
                                {t("workouts.workout.add_day_btn")}
                            </Button>
                            <Button type="primary" className="bg-brand-primary" block onClick={publishWorkout}>
                                {t("workouts.workout.publish_btn")}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
