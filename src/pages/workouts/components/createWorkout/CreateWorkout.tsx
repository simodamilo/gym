import { ArrowRightOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, type RootState } from "../../../../store";
import { workoutsActions } from "../../../../store/workouts/workouts.action";
import { useSelector } from "react-redux";
import { workoutsSelectors } from "../../../../store/workouts/workouts.selector";
import { Button, Input } from "antd";
import type { Day } from "../../../../store/days/types";

interface CreateWorkoutProps {
    setOpenCreateWorkout: (open: boolean) => void;
}

export const CreateWorkout = (props: CreateWorkoutProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [days, setDays] = useState<Day[]>([]);

    const draftWorkout = useSelector((state: RootState) => workoutsSelectors.getDraftWorkout(state));

    useEffect(() => {
        if (draftWorkout) {
            setDays(draftWorkout.days);
        }
    }, [draftWorkout]);

    useEffect(() => {
        getDraft();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getDraft = async () => {
        await dispatch(workoutsActions.fetchDraftWorkout());
    };

    const handleAddDay = () => {
        setDays((prevDays) => [
            ...prevDays,
            {
                id: prevDays.length + 1,
                name: "",
                exercises: [],
            },
        ]);
    };

    return (
        <div className="w-full h-screen max-h-full md:w-3xl flex flex-col justify-between gap-4">
            <div className="flex justify-end w-full">
                <CloseOutlined onClick={() => props.setOpenCreateWorkout(false)} />
            </div>
            {days && days.length > 0 ? (
                <div className="flex-1 overflow-y-auto flex flex-col gap-2">
                    {days.map((day, index) => {
                        return (
                            <div key={index} className="p-3 border rounded-xl">
                                <Input size="small" placeholder={t("workouts.create_workout.day_name_placeholder")} value={day.name} onChange={(input) => console.log("TEST", input)} />
                                <div className="flex justify-between items-center mt-4">
                                    <DeleteOutlined />
                                    <ArrowRightOutlined />
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div>No Draft available</div>
            )}
            <div className="sticky bottom-0">
                <Button type="primary" block onClick={handleAddDay}>
                    {t("workouts.create_workout.add_day_btn")}
                </Button>
            </div>
        </div>
    );
};
