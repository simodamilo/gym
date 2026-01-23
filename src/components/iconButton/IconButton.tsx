import type React from "react";
import { type SyntheticEvent } from "react";
import { motion } from "framer-motion";

interface IconButtonProps {
    onClick: (e: SyntheticEvent) => void;
    icon: React.ReactNode;
    disabled?: boolean;
}

export const IconButton = ({ onClick, icon, disabled }: IconButtonProps) => {
    return (
        <motion.button
            disabled={disabled}
            onClick={(e) => onClick(e)}
            className="w-10 h-10 min-w-10 rounded-full flex items-center justify-center border cursor-pointer shadow-var-sm bg-[var(--bg-elevated)] border-[var(--border-default)] text-[var(--text-primary)]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
        >
            <span className="text-[var(--text-primary)]">{icon}</span>
        </motion.button>
    );
};
