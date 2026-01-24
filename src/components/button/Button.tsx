import { motion } from "framer-motion";

interface ButtonProps {
    onClick: () => void;
    label: string;
    disabled?: boolean;
}

export const Button = ({ onClick, label, disabled }: ButtonProps) => {
    return (
        <motion.button
            disabled={disabled}
            onClick={onClick}
            className="w-full h-10 rounded-full flex items-center justify-center border cursor-pointer shadow-var-sm bg-[var(--bg-elevated)] border-[var(--border-default)] text-[var(--text-primary)]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
        >
            <span className="text-[var(--text-primary)] text-sm font-medium">{label}</span>
        </motion.button>
    );
};
