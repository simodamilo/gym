import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Skeleton } from "antd";
import { useAppDispatch } from "../../../store";
import type { RootState } from "../../../store";
import { currentActions } from "../../../store/current/current.actions";
import { currentSelectors } from "../../../store/current/current.selectors";
import { ItemCard } from "../components/itemCard/ItemCard";
import { useNavigate } from "react-router-dom";

export const Current = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const currentWorkout = useSelector((state: RootState) => currentSelectors.getCurrentWorkout(state));
    const isLoading = useSelector((state: RootState) => currentSelectors.isLoading(state));

    useEffect(() => {
        dispatch(currentActions.fetchCurrentWorkout());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading && !currentWorkout) {
        return <Skeleton active />;
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
                        title={day.name || ''}
                        exerciseCount={exerciseCount}
                        onClick={() => {
                            navigate(`${day?.id}/exercises`);
                            dispatch(currentActions.showSwitcher(false));
                        }}
                        trainingCounter={day.counter}
                        isLast={day.isLast}
                        borderColor="var(--semantic-success)"
                    />
                );
            })}
        </div>
    );
};
