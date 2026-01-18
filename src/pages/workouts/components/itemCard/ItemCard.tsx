import { DeleteOutlined, EditOutlined, HolderOutlined, RightOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import type { Day } from "../../../../store/draft/types";
import { IconButton } from "../../../../components/iconButton/IconButton";

interface ItemCardProps {
    title: string;
    exerciseCount: number;
    onClick?: () => void;
    borderColor?: string;
    // only for current
    trainingCounter?: number;
    isLast?: boolean;
    // only for creation
    isCreation?: boolean;
    day?: Day;
    handleDayUpdate?: (day: Day, type: "DELETE" | "UPDATE") => void;
    isDraggable?: boolean;
}

export const ItemCard = (props: ItemCardProps) => {
    const {
        title,
        exerciseCount,
        borderColor = "var(--semantic-success)",
        onClick,
        trainingCounter,
        isLast,
        isCreation,
        handleDayUpdate,
        day,
        isDraggable
    } = props;

    return (
        <motion.div
            onClick={onClick}
            className="relative rounded-2xl cursor-pointer overflow-hidden"
            style={{
                backgroundColor: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                boxShadow: "var(--shadow-md)",
                borderLeft: `4px solid ${borderColor}`,
            }}
            whileHover={{ scale: 1.01, boxShadow: "var(--shadow-lg)" }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.2 }}
        >
            <div className="flex items-center justify-between p-4">
                {isDraggable && (
                    <HolderOutlined className="text-white/60 text-lg cursor-grab active:cursor-grabbing mr-4" />
                )}
                {/* Left side: Title and metadata */}
                <div className="flex-1 min-w-0">
                    <h3
                        className="text-base font-semibold mb-0.5 truncate"
                        style={{ color: "var(--text-primary)" }}
                    >
                        {title}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span
                            className="text-sm"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            {exerciseCount} Exercise{exerciseCount !== 1 ? "s" : ""}
                        </span>
                        {isLast && (
                            <span
                                className="text-xs font-semibold px-2 py-0.5 rounded"
                                style={{
                                    backgroundColor: "var(--semantic-success)",
                                    color: "white",
                                }}
                            >
                                LAST
                            </span>
                        )}
                    </div>
                </div>

                {/* Right side: Counter badge and chevron */}
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    {
                        isCreation && day && (
                            <div className="flex justify-between items-center gap-2">
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <IconButton
                                        icon={<DeleteOutlined className="text-white" />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDayUpdate?.(day, "DELETE");
                                        }}
                                    />
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <IconButton
                                        icon={<EditOutlined className="text-white" />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDayUpdate?.(day, "UPDATE");
                                        }}
                                    />
                                </motion.div>
                            </div>
                        )
                    }
                    {trainingCounter !== undefined && (
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                            style={{
                                backgroundColor: "var(--bg-tertiary)",
                                color: "var(--text-primary)",
                            }}
                        >
                            {trainingCounter}
                        </div>
                    )}
                    {
                        !isCreation && (
                            <RightOutlined
                                style={{
                                    fontSize: "14px",
                                    color: "var(--text-tertiary)",
                                }}
                            />
                        )
                    }
                </div>
            </div>
        </motion.div>
    );
};
