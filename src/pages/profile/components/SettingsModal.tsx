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
            title={t("profile.settings.title")}
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            styles={{
                content: {
                    backgroundColor: 'var(--bg-elevated)',
                    borderRadius: '16px',
                },
                header: {
                    backgroundColor: 'var(--bg-elevated)',
                    borderBottom: 'none',
                    paddingBottom: '12px',
                },
                body: {
                    paddingTop: '12px',
                    paddingBottom: '24px',
                },
            }}
        >
            <div className="space-y-6 py-4">
                {/* Theme Toggle */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {mode === "dark" ? (
                            <MoonOutlined className="text-lg" />
                        ) : (
                            <SunOutlined className="text-lg" />
                        )}
                        <span className="text-base font-medium">
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
                    <span className="text-base font-medium">
                        {t("profile.settings.language")}
                    </span>
                    <Select
                        value={i18n.language}
                        onChange={handleLanguageChange}
                        className="w-[150px]"
                        options={[
                            { value: "en", label: "English" },
                            { value: "es", label: "Español" },
                        ]}
                    />
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-200 dark:border-neutral-700" />

                {/* Sign Out Button */}
                <Button
                    type="primary"
                    danger
                    block
                    size="large"
                    icon={<LogoutOutlined />}
                    onClick={handleSignOut}
                >
                    {t("profile.settings.sign_out")}
                </Button>
            </div>
        </Modal>
    );
};
