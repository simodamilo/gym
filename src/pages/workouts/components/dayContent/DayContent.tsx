import { ArrowRightOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { Day } from "../../../../store/draft/types";
import { useTranslation } from "react-i18next";
import { Button } from "antd";

interface DayContentProps {
    day: Day;
    isReadOnly?: boolean;
    setOpenExercisesId: (id: string) => void;
    handleDayUpdate?: (day: Day, type: "DELETE" | "UPDATE") => void;
}

export const DayContent = (props: DayContentProps) => {
    const { t } = useTranslation();

    if (props.isReadOnly) {
        return (
            <div onClick={() => props.setOpenExercisesId(props.day.id)} className="p-3 border border-[#FFEAD8] shadow-md rounded-md flex items-center justify-between">
                <p>{props.day.name}</p>
                <div className="flex items-center gap-4">
                    {props.day.isLast && <div className="text-[10px] border border-[#00b300] px-2 py-[2px] rounded-md">{t("workouts.workout_page.is_last")}</div>}
                    <div className="text-[10px] border border-[#4682a9] px-2 py-[2px] rounded-md">{`${props.day.counter}`}</div>
                    <ArrowRightOutlined />
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-between items-center p-3 border border-[#FFEAD8] shadow-md rounded-md">
            <p className="text-left">{props.day.name}</p>

            <div className="flex justify-between items-center gap-4">
                <Button size="large" icon={<DeleteOutlined />} type="primary" danger shape="circle" onClick={() => props.handleDayUpdate?.(props.day, "DELETE")} />
                <Button size="large" icon={<EditOutlined />} type="primary" shape="circle" onClick={() => props.handleDayUpdate?.(props.day, "UPDATE")} />
                <Button size="large" icon={<ArrowRightOutlined />} type="primary" shape="circle" onClick={() => props.setOpenExercisesId(props.day.id)} />
            </div>
        </div>
    );
};
