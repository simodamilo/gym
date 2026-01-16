import { RightOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

interface WorkoutCardProps {
    title: string;
    exerciseCount: number;
    counter?: number;
    isLast?: boolean;
    borderColor?: string;
    onClick: () => void;
}

export const WorkoutCard = ({
    title,
    exerciseCount,
    counter,
    isLast,
    borderColor = "var(--semantic-success)",
    onClick,
}: WorkoutCardProps) => {
    return (
        <motion.div
            onClick={onClick}
            className="relative rounded-2xl cursor-pointer overflow-hidden"
            style={{
                backgroundColor: "var(--bg-elevated)",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-md)",
                borderLeft: `4px solid ${borderColor}`,
            }}
            whileHover={{ scale: 1.01, boxShadow: "var(--shadow-lg)" }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.2 }}
        >
            <div className="flex items-center justify-between p-4">
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
                    {counter !== undefined && (
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                            style={{
                                backgroundColor: "var(--bg-tertiary)",
                                color: "var(--text-primary)",
                            }}
                        >
                            {counter}
                        </div>
                    )}
                    <RightOutlined
                        style={{
                            fontSize: "14px",
                            color: "var(--text-tertiary)",
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
};
