import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/ThemeProvider';

export const ThemeToggle = () => {
    const { t } = useTranslation();
    const { mode, toggleTheme } = useTheme();
    const isDark = mode === 'dark';

    return (
        <motion.button
            onClick={toggleTheme}
            className="relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-var-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isDark ? t("accessibility.theme_toggle_light") : t("accessibility.theme_toggle_dark")}
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: isDark ? 180 : 0,
                    scale: isDark ? 1 : 1,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                {isDark ? (
                    <BulbFilled
                        className="text-xl text-[var(--brand-primary)]"
                    />
                ) : (
                    <BulbOutlined
                        className="text-xl text-[var(--text-secondary)]"
                    />
                )}
            </motion.div>
        </motion.button>
    );
};
