import { LogoutOutlined, PlayCircleOutlined, PlusOutlined, UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { routes } from "../../utils/routing/routes";
import { supabase } from "../../store/supabaseClient";
import { exercisesCatalogActions } from "../../store/exercisesCatalog/exercisesCatalog.action";
import { useAppDispatch } from "../../store";
import { currentActions } from "../../store/current/current.actions";
import logo from "../../assets/logo.png";

interface MenuItem {
    nameKey: string;
    icon: React.ReactNode;
    path: string;
    action?: () => void;
}

export const DesktopNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Logout error:", error.message);
        }
    };

    const handleCreateWorkout = () => {
        navigate(routes.workoutsCreate);
        dispatch(currentActions.showSwitcher(false));
    };

    const handleCreateExercise = () => {
        dispatch(exercisesCatalogActions.manageCreateModal(true));
    };

    const menus: MenuItem[] = [
        { nameKey: "navigation.profile", icon: <UserOutlined />, path: "/gym/profile" },
        { nameKey: "navigation.workouts", icon: <PlayCircleOutlined />, path: "/gym/workouts" },
        { nameKey: "navigation.exercises", icon: <UnorderedListOutlined />, path: "/gym/exercises" },
    ];

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + "/");
    };

    const getActionButton = () => {
        if (location.pathname === "/gym/profile") {
            return {
                icon: <LogoutOutlined />,
                label: t("navigation.logout"),
                onClick: handleLogout,
                danger: true,
            };
        } else if (location.pathname.startsWith("/gym/workouts")) {
            return {
                icon: <PlusOutlined />,
                label: t("navigation.new_workout"),
                onClick: handleCreateWorkout,
                danger: false,
            };
        } else if (location.pathname.startsWith("/gym/exercises")) {
            return {
                icon: <PlusOutlined />,
                label: t("navigation.new_exercise"),
                onClick: handleCreateExercise,
                danger: false,
            };
        }
        return null;
    };

    const actionButton = getActionButton();

    return (
        <div className="hidden md:flex flex-col w-64 h-screen border-r bg-[var(--bg-elevated)] border-[var(--border-default)] shadow-var-md">
            {/* Header */}
            <div className="p-6 border-b border-[var(--border-default)] text-[var(--text-tertiary)]">
                <div className="flex gap-4 items-center mb-2">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="GymTracker Logo" className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text">{t("app.name")}</h1>
                </div>
                <p className="text-sm mt-1">{t("app.tagline")}</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menus.map((menu) => {
                        const active = isActive(menu.path);
                        return (
                            <li key={menu.path}>
                                <motion.button
                                    onClick={() => navigate(menu.path)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border ${
                                        active
                                            ? "bg-primary-50 text-[var(--brand-primary)] border-[var(--brand-primary)] font-semibold"
                                            : "bg-transparent text-[var(--text-primary)] border-transparent font-medium"
                                    }`}
                                    whileHover={{
                                        backgroundColor: active ? "#e6f4ff" : "var(--bg-tertiary)",
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="text-xl">{menu.icon}</span>
                                    <span>{t(menu.nameKey)}</span>
                                </motion.button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Action Button */}
            {actionButton && (
                <div className="p-4 border-t border-[var(--border-default)]">
                    <motion.button
                        onClick={actionButton.onClick}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-white shadow-var-md ${actionButton.danger ? "bg-[var(--semantic-error)]" : "bg-gradient-to-br from-[var(--brand-primary)] to-[var(--accent)]"}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="text-lg">{actionButton.icon}</span>
                        <span>{actionButton.label}</span>
                    </motion.button>
                </div>
            )}
        </div>
    );
};
