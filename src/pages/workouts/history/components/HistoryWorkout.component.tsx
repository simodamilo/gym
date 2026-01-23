import { ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../store";
import { Skeleton } from "antd";
import type { Day, Workout } from "../../../../store/draft/types";
import { useSelector } from "react-redux";
import { currentActions } from "../../../../store/current/current.actions";
import { useNavigate, useParams } from "react-router-dom";
import { historySelectors } from "../../../../store/history/history.selectors";
import { routes } from "../../../../utils/routing/routes";
import { ItemCard } from "../../components/itemCard/ItemCard";

export const HistoryWorkout = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { workoutId } = useParams();

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [workout, setWorkout] = useState<Workout>();
    const [days, setDays] = useState<Day[]>([]);

    const archivedWorkouts = useSelector(historySelectors.getHistoryWorkouts);
    const isLoading = useSelector(historySelectors.isLoading);

    useEffect(() => {
        if (workoutId) {
            const currentWorkout = archivedWorkouts.find((workout) => workout.id === workoutId);
            setWorkout(currentWorkout);
            const newDays = [...currentWorkout!.days];
            setDays(newDays.sort((a, b) => (a.order || 0) - (b.order || 0)));
        }
    }, [archivedWorkouts, workoutId]);

    if (isLoading && !workout) {
        return <Skeleton active />;
    }

    return (
        <div className={`w-full h-full max-h-full flex flex-col gap-2 justify-around pt-4`}>
            <div className="flex flex-col gap-4">
                <div className={`flex w-full justify-start`}>
                    <button
                        onClick={() => {
                            navigate(routes.workoutsHistory);
                            dispatch(currentActions.showSwitcher(true));
                        }}
                        className="bg-transparent border-0 p-0 cursor-pointer text-2xl leading-none transition-all duration-150 flex items-center justify-center hover:-translate-x-0.5 active:scale-95 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                        aria-label="Go back"
                    >
                        <ArrowLeftOutlined />
                    </button>
                </div>
                {days && days.length > 0 && <p className="text-left text-[12px] italic">{t("workouts.workout_page.description")}</p>}
            </div>
            {days && days.length > 0 ? (
                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto flex flex-col gap-2 hide-scrollbar pb-28 rounded-b-xl px-2">
                    {days.map((day) => {
                        const exerciseCount = day.dayExercises?.length || 0;

                        return (
                            <ItemCard
                                key={day.id}
                                title={day.name || ""}
                                exerciseCount={exerciseCount}
                                onClick={() => {
                                    navigate(`${day?.id}/exercises`);
                                }}
                                trainingCounter={day.counter}
                                borderColor="var(--semantic-success)"
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="flex h-full items-center mx-auto">{t("workouts.workout_page.no_workout")}</div>
            )}
        </div>
    );
};
