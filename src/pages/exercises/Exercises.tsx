import { useEffect } from "react";
import { useAppDispatch, type RootState } from "../../store";
import { exercisesActions } from "../../store/exercises/exercises.action";
import { useSelector } from "react-redux";
import { exercisesSelectors } from "../../store/exercises/exercises.selector";
import type { Exercise } from "../../store/exercises/types";

export const Exercises = () => {
  const dispatch = useAppDispatch();

  const exercises = useSelector((state: RootState) =>
    exercisesSelectors.getExercises(state)
  );

  useEffect(() => {
    getExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getExercises = async () => {
    await dispatch(exercisesActions.fetchAllExercises());
  };

  return (
    <div>
      <h1>Exercises Page</h1>
      {exercises.map((exercise: Exercise) => {
        return <div key={exercise.id}>{exercise.name}</div>;
      })}
    </div>
  );
};
