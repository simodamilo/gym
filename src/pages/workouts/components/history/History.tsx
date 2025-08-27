import { useEffect } from "react"
import { useAppDispatch } from "../../../../store";
import { historyActions } from "../../../../store/history/history.actions";
import { useSelector } from "react-redux";
import { historySelectors } from "../../../../store/history/history.selectors";
import { useNavigate } from "react-router-dom";

export const History = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const workouts = useSelector(historySelectors.getHistoryWorkouts);

    useEffect(() => {
        dispatch(historyActions.fetchHistoryWorkout());
    }, []);

    return (
        <div className="flex flex-col gap-2">
            {workouts.map((workout) => {
                return (
                    <div onClick={() => navigate(`${workout.id}`)} className="bg-[var(--primary-color)] shadow-lg rounded-lg flex items-center justify-between p-3 py-4">
                        <p className="font-bold mb-0 leading-none">{new Date(workout.startDate || '').toDateString()} - {new Date(workout.endDate || '').toDateString()}</p>
                    </div>
                );
            })}
        </div>
    )
}