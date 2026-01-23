import { Modal, Switch, Select, Button } from "antd";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../theme/ThemeProvider";
import { MoonOutlined, SunOutlined, LogoutOutlined } from "@ant-design/icons";
import { supabase } from "../../../store/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store";

interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
}

export const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
    const { t, i18n } = useTranslation();
    const { mode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLanguageChange = (value: string) => {
        i18n.changeLanguage(value);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        dispatch({ type: "RESET_STORE" });
        navigate("/login");
        onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            closable={true}
            styles={{
                content: {
                    backgroundColor: 'var(--bg-elevated)',
                    borderRadius: '20px',
                    padding: '0',
                    overflow: 'hidden',
                },
                mask: {
                    backdropFilter: 'blur(8px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
            }}
        >
            <div className="px-6 pt-8 pb-6 flex flex-col gap-6 max-[480px]:px-5 max-[480px]:pt-6 max-[480px]:pb-5">
                {/* Title */}
                <h3 className="m-0 text-xl font-semibold text-[var(--text-primary)] text-center leading-snug max-[480px]:text-lg">
                    {t("profile.settings.title")}
                </h3>

                {/* Theme Toggle */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {mode === "dark" ? (
                            <MoonOutlined className="text-lg text-[var(--text-primary)]" />
                        ) : (
                            <SunOutlined className="text-lg text-[var(--text-primary)]" />
                        )}
                        <span className="text-base font-medium text-[var(--text-primary)]">
                            {t("profile.settings.theme")}
                        </span>
                    </div>
                    <Switch
                        checked={mode === "dark"}
                        onChange={toggleTheme}
                        checkedChildren={t("profile.settings.dark")}
                        unCheckedChildren={t("profile.settings.light")}
                    />
                </div>

                {/* Language Selector */}
                <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-[var(--text-primary)]">
                        {t("profile.settings.language")}
                    </span>
                    <Select
                        value={i18n.language}
                        onChange={handleLanguageChange}
                        className="w-[150px]"
                        options={[
                            { value: "en", label: "English" },
                            { value: "es", label: "Español" },
                            { value: "it", label: "Italiano" },
                        ]}
                    />
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--border-default)]" />

                {/* Sign Out Button */}
                <Button
                    type="primary"
                    danger
                    block
                    size="large"
                    icon={<LogoutOutlined />}
                    onClick={handleSignOut}
                    className="h-11 rounded-xl text-[15px] font-semibold"
                >
                    {t("profile.settings.sign_out")}
                </Button>
            </div>
        </Modal>
    );
};
