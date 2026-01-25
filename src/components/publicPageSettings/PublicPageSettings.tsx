import { Select } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../theme/ThemeProvider";
import { motion } from "framer-motion";

export const PublicPageSettings = () => {
    const { t, i18n } = useTranslation();
    const { mode, toggleTheme } = useTheme();
    const isDark = mode === "dark";

    const handleLanguageChange = (value: string) => {
        i18n.changeLanguage(value);
    };

    return (
        <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
            {/* Language Selector */}
            <Select
                value={i18n.language}
                onChange={handleLanguageChange}
                className="w-[100px]"
                size="middle"
                options={[
                    { value: "en", label: "EN" },
                    { value: "es", label: "ES" },
                    { value: "it", label: "IT" },
                ]}
                aria-label={t("accessibility.change_language")}
            />

            {/* Theme Toggle */}
            <motion.button
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isDark ? t("accessibility.theme_toggle_light") : t("accessibility.theme_toggle_dark")}
            >
                <motion.div
                    initial={false}
                    animate={{
                        rotate: isDark ? 180 : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    {isDark ? (
                        <MoonOutlined className="text-lg text-[var(--brand-primary)]" />
                    ) : (
                        <SunOutlined className="text-lg text-[var(--text-secondary)]" />
                    )}
                </motion.div>
            </motion.button>
        </div>
    );
};
