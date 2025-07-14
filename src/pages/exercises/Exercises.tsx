import { useEffect, useState } from "react";
import { useAppDispatch, type RootState } from "../../store";
import { exercisesActions } from "../../store/exercises/exercises.action";
import { useSelector } from "react-redux";
import { exercisesSelectors } from "../../store/exercises/exercises.selector";
import type { Exercise } from "../../store/exercises/types";
import { Link } from "react-router-dom";
import { Button, Input, Space } from "antd";

export const Exercises = () => {
  const dispatch = useAppDispatch();

  const [newExerciseName, setNewExerciseName] = useState("");

  const exercises = useSelector((state: RootState) => exercisesSelectors.getExercises(state));

  useEffect(() => {
    getExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getExercises = async () => {
    await dispatch(exercisesActions.fetchAllExercises());
  };

  const addExercise = async () => {
    await dispatch(
      exercisesActions.addExercise({
        name: newExerciseName,
        created: Date.now(),
      })
    );
  };

  return (
    <div className="w-full h-screen lg:w-5xl">
      <div className="flex items-start p-4">
        <Link to="/">Back</Link>
      </div>
      <div className="flex flex-col items-start p-4">
        <Space direction="vertical" size="middle" className="w-full lg:w-xl">
          <Space.Compact className="w-full">
            <Input placeholder="Add a new exercise" onChange={(input) => setNewExerciseName(input.target.value)} />
            <Button type="primary" onClick={addExercise}>
              Add
            </Button>
          </Space.Compact>
        </Space>
      </div>

      {exercises.map((exercise: Exercise) => {
        return <div key={exercise.id}>{exercise.name}</div>;
      })}
    </div>
  );
};
