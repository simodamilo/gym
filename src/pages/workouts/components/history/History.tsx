import { useEffect } from "react";
import { useAppDispatch } from "../../../../store";
import { historyActions } from "../../../../store/history/history.actions";
import { useSelector } from "react-redux";
import { historySelectors } from "../../../../store/history/history.selectors";
import { useNavigate } from "react-router-dom";
import { WorkoutCard } from "../../../../components/workoutCard/WorkoutCard";

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
                <span style={{ color: "var(--text-tertiary)" }}>
                    No workout history yet. Complete a workout to see it here!
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 pb-28 hide-scrollbar overflow-auto px-1">
            {workouts.map((workout) => {
                // Calculate total exercises across all days
                const totalExercises = workout.days?.reduce(
                    (sum, day) => sum + (day.dayExercises?.length || 0),
                    0
                ) || 0;

                return (
                    <WorkoutCard
                        key={workout.id}
                        title={formatDateRange(workout.startDate, workout.endDate)}
                        exerciseCount={totalExercises}
                        borderColor="var(--brand-primary)"
                        onClick={() => navigate(`${workout.id}`)}
                    />
                );
            })}
        </div>
    );
};
