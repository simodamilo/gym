import { ArrowRightOutlined, DeleteOutlined, EditOutlined, HolderOutlined } from "@ant-design/icons";
import type { Day } from "../../../../store/draft/types";
import { useTranslation } from "react-i18next";
import { IconButton } from "../../../../components/iconButton/IconButton";

interface DayContentProps {
    day: Day;
    isReadOnly?: boolean;
    isDraggable?: boolean;
    setOpenExercisesId: (id: string) => void;
    handleDayUpdate?: (day: Day, type: "DELETE" | "UPDATE") => void;
}

export const DayContent = (props: DayContentProps) => {
    const { t } = useTranslation();

    if (props.isReadOnly) {
        return (
            <div onClick={() => props.setOpenExercisesId(props.day.id)} className="bg-[var(--primary-color)] shadow-lg rounded-lg flex items-center justify-between p-3">
                <p className="font-bold">{props.day.name}</p>
                <div className="flex items-center gap-4">
                    {props.day.isLast && <div className="text-[10px] border border-[var(--secondary-color)] px-2 py-[2px] rounded-md">{t("workouts.workout_page.is_last")}</div>}
                    <div className="text-[10px] border px-2 py-[2px] rounded-md">{`${props.day.counter}`}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[var(--primary-color)] shadow-lg rounded-lg flex justify-between items-center p-3">
            <div className="flex items-center gap-4">
                {props.isDraggable && <HolderOutlined />}
                <p className="font-bold">{props.day.name}</p>
            </div>

            <div className="flex justify-between items-center gap-4">
                <IconButton icon={<DeleteOutlined />} onClick={() => props.handleDayUpdate?.(props.day, "DELETE")} />
                <IconButton icon={<EditOutlined />} onClick={() => props.handleDayUpdate?.(props.day, "UPDATE")} />
                <IconButton icon={<ArrowRightOutlined />} onClick={() => props.setOpenExercisesId(props.day.id)} />
            </div>
        </div>
    );
};
