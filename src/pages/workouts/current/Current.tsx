import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Skeleton } from "antd";
import { useAppDispatch } from "../../../store";
import type { RootState } from "../../../store";
import { currentActions } from "../../../store/current/current.actions";
import { currentSelectors } from "../../../store/current/current.selectors";
import { ExercisesList } from "../components/exercisesList/ExercisesList";
import type { Day } from "../../../store/draft/types";
import { ItemCard } from "../components/itemCard/ItemCard";

export const Current = () => {
    const dispatch = useAppDispatch();
    const [openExercisesId, setOpenExercisesId] = useState<string>();

    const currentWorkout = useSelector((state: RootState) => currentSelectors.getCurrentWorkout(state));
    const isLoading = useSelector((state: RootState) => currentSelectors.isLoading(state));

    useEffect(() => {
        dispatch(currentActions.fetchCurrentWorkout());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // Control PageSwitcher visibility based on whether we're viewing exercises
        dispatch(currentActions.showSwitcher(openExercisesId === undefined));
    }, [openExercisesId, dispatch]);

    const handleStartClick = async (dayId: string) => {
        const now = new Date();
        const newDay: Day | undefined = currentWorkout?.days.find((day) => day.id === dayId);

        if (newDay) {
            await dispatch(
                currentActions.updateDayStart({
                    id: newDay.id,
                    last_workout: now.getTime(),
                    workout_id: currentWorkout!.id,
                    name: newDay.name,
                    counter: newDay.counter ? newDay.counter + 1 : 1,
                    is_last: true,
                    order: newDay.order,
                })
            );
        }
    };

    if (isLoading && !currentWorkout) {
        return <Skeleton active />;
    }

    // If viewing exercises for a specific day, show ExercisesList
    if (openExercisesId && currentWorkout) {
        const selectedDay = currentWorkout.days.find((day: Day) => day.id === openExercisesId);

        return (
            <ExercisesList
                workoutId={currentWorkout.id}
                dayId={openExercisesId}
                dayExercises={selectedDay?.dayExercises ?? []}
                isDraft={false}
                isCurrent={true}
                isHistory={false}
                setOpenExercisesId={setOpenExercisesId}
                handleStartClick={handleStartClick}
                lastWorkout={selectedDay?.lastWorkout}
            />
        );
    }

    // Show card list view
    if (!currentWorkout || !currentWorkout.days || currentWorkout.days.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">
                <span style={{ color: "var(--text-tertiary)" }}>
                    No workout available. Create one to get started!
                </span>
            </div>
        );
    }

    // Sort days by order
    const sortedDays = [...currentWorkout.days].sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
        <div className="flex flex-col gap-3 pb-28 hide-scrollbar overflow-auto px-1">
            {sortedDays.map((day) => {
                const exerciseCount = day.dayExercises?.length || 0;

                return (
                    <ItemCard
                        key={day.id}
                        title={day.name || "Unnamed Day"}
                        exerciseCount={exerciseCount}
                        counter={day.counter}
                        isLast={day.isLast}
                        borderColor="var(--semantic-success)"
                    />
                );
            })}
        </div>
    );
};
