import { motion } from "framer-motion";

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    animated?: boolean;
    className?: string;
}

export const EmptyState = ({ icon, title, description, animated = true, className = "" }: EmptyStateProps) => {
    const content = (
        <div className={`flex flex-col flex-1 items-center justify-center gap-4 ${className}`}>
            <div className="text-6xl text-[var(--brand-primary)] opacity-50">
                {icon}
            </div>
            <p className="text-base text-[var(--text-secondary)]">
                {title}
            </p>
            {description && (
                <p className="text-sm text-center max-w-sm text-[var(--text-tertiary)]">
                    {description}
                </p>
            )}
        </div>
    );

    if (animated) {
        return (
            <motion.div
                className="flex flex-col flex-1 items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="text-6xl text-[var(--brand-primary)] opacity-50">
                    {icon}
                </div>
                <p className="text-base text-[var(--text-secondary)]">
                    {title}
                </p>
                {description && (
                    <p className="text-sm text-center max-w-sm text-[var(--text-tertiary)]">
                        {description}
                    </p>
                )}
            </motion.div>
        );
    }

    return content;
};
