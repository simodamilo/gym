import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface IProps {
    active: string;
    onChange: (key: string) => void;
}

export const PageSwitcher = ({ active, onChange }: IProps) => {
    const { t } = useTranslation();

    const items = [
        {
            key: "current",
            label: t("workouts.current_tab"),
        },
        {
            key: "history",
            label: t("workouts.history_tab"),
        },
    ];

    return (
        <div className="flex w-full rounded-[20px] p-1.5 gap-1.5 shadow-var-sm bg-[var(--bg-elevated)] border border-[var(--border-default)]">
            {items.map(({ key, label }) => {
                const isActive = active === key;
                return (
                    <motion.button
                        key={key}
                        onClick={() => onChange(key)}
                        className={`flex-1 h-10 rounded-[16px] font-semibold text-base transition-all duration-300 cursor-pointer shadow-sm ${
                            isActive ? 'bg-[var(--brand-primary)] text-white' : 'bg-transparent text-[var(--text-secondary)]'
                        }`}
                        whileHover={{
                            backgroundColor: isActive ? undefined : 'var(--bg-secondary)',
                        }}
                        whileTap={{ scale: 0.98 }}
                        animate={{
                            scale: isActive ? 1 : 1,
                        }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                        {label}
                    </motion.button>
                );
            })}
        </div>
    );
};
