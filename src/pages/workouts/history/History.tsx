import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store";
import { historySelectors } from "../../../store/history/history.selectors";
import { historyActions } from "../../../store/history/history.actions";
import { ItemCard } from "../components/itemCard/ItemCard";
import { currentActions } from "../../../store/current/current.actions";

export const History = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const workouts = useSelector(historySelectors.getHistoryWorkouts);

    useEffect(() => {
        dispatch(historyActions.fetchHistoryWorkout());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Format date range for display
    const formatDateRange = (startDate?: number, endDate?: number): string => {
        if (!startDate || !endDate) {
            return "Unknown Date";
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const startFormatted = start.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const endFormatted = end.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        return `${startFormatted} - ${endFormatted}`;
    };

    if (!workouts || workouts.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">
                <span className="text-[var(--text-tertiary)]">
                    No workout history yet. Complete a workout to see it here!
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 pb-28 hide-scrollbar overflow-auto md:px-2">
            {workouts.map((workout) => {
                // Calculate total exercises across all days
                const totalExercises = workout.days?.reduce(
                    (sum, day) => sum + (day.dayExercises?.length || 0),
                    0
                ) || 0;

                return (
                    <ItemCard
                        key={workout.id}
                        title={formatDateRange(workout.startDate, workout.endDate)}
                        exerciseCount={totalExercises}
                        borderColor="var(--brand-primary)"
                        onClick={() => {
                            navigate(`${workout.id}/days`);
                            dispatch(currentActions.showSwitcher(false));
                        }}
                    />
                );
            })}
        </div>
    );
};
