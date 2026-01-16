import { ArrowRightOutlined, DeleteOutlined, EditOutlined, HolderOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
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
            <motion.div
                onClick={() => props.setOpenExercisesId(props.day.id)}
                className="rounded-[20px] flex items-center justify-between px-5 py-4 cursor-pointer transition-all duration-200"
                style={{
                    background: 'linear-gradient(135deg, var(--brand-primary) 0%, #3b82f6 100%)',
                    boxShadow: 'var(--shadow-md)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <p className="font-bold text-lg text-white">{props.day.name}</p>
                <div className="flex items-center gap-2">
                    {props.day.isLast && (
                        <div className="text-xs font-semibold bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full border border-white/30">
                            {t("workouts.workout_page.is_last")}
                        </div>
                    )}
                    <div className="text-sm font-bold bg-white/30 backdrop-blur-sm text-white w-8 h-8 flex items-center justify-center rounded-full border border-white/40">
                        {props.day.counter}
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="rounded-[20px] flex justify-between items-center px-5 py-4"
            style={{
                background: 'linear-gradient(135deg, var(--brand-primary) 0%, #3b82f6 100%)',
                boxShadow: 'var(--shadow-md)',
            }}
            whileHover={{ scale: 1.01 }}
        >
            <div className="flex items-center gap-4">
                {props.isDraggable && (
                    <HolderOutlined className="text-white/60 text-lg cursor-grab active:cursor-grabbing" />
                )}
                <p className="font-bold text-lg text-white">{props.day.name}</p>
            </div>

            <div className="flex justify-between items-center gap-2">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <IconButton
                        icon={<DeleteOutlined className="text-white" />}
                        onClick={() => props.handleDayUpdate?.(props.day, "DELETE")}
                    />
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <IconButton
                        icon={<EditOutlined className="text-white" />}
                        onClick={() => props.handleDayUpdate?.(props.day, "UPDATE")}
                    />
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <IconButton
                        icon={<ArrowRightOutlined className="text-white" />}
                        onClick={() => props.setOpenExercisesId(props.day.id)}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};
