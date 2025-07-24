import { LeftOutlined } from "@ant-design/icons";
import { Collapse, type CollapseProps } from "antd";
import { draftSelectors } from "../../../../store/draft/draft.selectors";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store";
import { useEffect, useState } from "react";

interface ExercisesProps {
    dayId: number;
    setOpenExercisesId: (id?: number) => void;
}

export const Exercises = (props: ExercisesProps) => {
    const [items, setItems] = useState<CollapseProps["items"]>([]);

    const exercises = useSelector((state: RootState) => draftSelectors.getDraftExercisesByDayId(state, props.dayId));
    console.log("Exercises for Day ID:", props.dayId, exercises);

    useEffect(() => {
        const newItems = exercises.map((exercise) => ({
            key: exercise.id.toString(),
            label: exercise.name,
            children: (
                <div className="p-4">
                    {/* Here you can add more details or actions related to the exercise */}
                    TEST
                </div>
            ),
        }));
        newItems.push({
            key: (newItems.length + 1).toString(),
            label: "New Exercise",
            children: (
                <div className="p-4">
                    {/* Add your form or input for new exercise here */}
                    New Exercise Form
                </div>
            ),
        });
        setItems(newItems);
    }, [exercises]);

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
