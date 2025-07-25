import { LeftOutlined } from "@ant-design/icons";
import { Collapse, type CollapseProps } from "antd";
import { draftSelectors } from "../../../../store/draft/draft.selectors";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store";
import { useEffect, useState } from "react";
import { ExerciseContent } from "../exercisesContent/ExerciseContent";

interface ExercisesProps {
    dayId: number;
    setOpenExercisesId: (id?: number) => void;
}

export const Exercises = (props: ExercisesProps) => {
    const [items, setItems] = useState<CollapseProps["items"]>([]);

    const day_exercises = useSelector((state: RootState) => draftSelectors.getDraftExercisesByDayId(state, props.dayId));
    console.log("Exercises for Day ID:", props.dayId, day_exercises);

    useEffect(() => {
        const newItems = day_exercises.map((day_exercise) => ({
            key: day_exercise.id.toString(),
            label: day_exercise.name,
            children: (
                <div>
                    <ExerciseContent dayId={props.dayId} exerciseId={day_exercise.id} exercise={day_exercise} />
                </div>
            ),
        }));
        const highestId = Math.max(...day_exercises.map((day_exercise) => day_exercise.id), 0) + 1;
        newItems.push({
            key: highestId.toString(),
            label: "",
            children: (
                <div>
                    <ExerciseContent dayId={props.dayId} exerciseId={highestId} />
                </div>
            ),
        });
        console.log("New items for Exercises:", newItems);
        setItems(newItems);
    }, [day_exercises, props.dayId]);

    return (
        <>
            <div className="flex justify-start w-full">
                <LeftOutlined onClick={() => props.setOpenExercisesId()} />
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-2">
                <Collapse items={items} defaultActiveKey={["1"]} onChange={() => console.log("TEST")} />
            </div>
        </>
    );
};
