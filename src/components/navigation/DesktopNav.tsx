import { LogoutOutlined, PlayCircleOutlined, PlusOutlined, UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { routes } from "../../utils/routing/routes";
import { supabase } from "../../store/supabaseClient";
import { exercisesCatalogActions } from "../../store/exercisesCatalog/exercisesCatalog.action";
import { useAppDispatch } from "../../store";
import { ThemeToggle } from "../themeToggle/ThemeToggle";
import { currentActions } from "../../store/current/current.actions";

interface MenuItem {
    name: string;
    icon: React.ReactNode;
    path: string;
    action?: () => void;
}

export const DesktopNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

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
        { name: "Profile", icon: <UserOutlined />, path: "/gym/profile" },
        { name: "Workouts", icon: <PlayCircleOutlined />, path: "/gym/workouts" },
        { name: "Exercises", icon: <UnorderedListOutlined />, path: "/gym/exercises" },
    ];

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const getActionButton = () => {
        if (location.pathname === '/gym/profile') {
            return {
                icon: <LogoutOutlined />,
                label: 'Logout',
                onClick: handleLogout,
                danger: true,
            };
        } else if (location.pathname.startsWith('/gym/workouts')) {
            return {
                icon: <PlusOutlined />,
                label: 'New Workout',
                onClick: handleCreateWorkout,
                danger: false,
            };
        } else if (location.pathname.startsWith('/gym/exercises')) {
            return {
                icon: <PlusOutlined />,
                label: 'New Exercise',
                onClick: handleCreateExercise,
                danger: false,
            };
        }
        return null;
    };

    const actionButton = getActionButton();

    return (
        <div
            className="hidden md:flex flex-col w-64 h-screen border-r"
            style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-default)',
            }}
        >
            {/* Header */}
            <div className="p-6 border-b" style={{ borderColor: 'var(--border-default)' }}>
                <h1
                    className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-purple bg-clip-text text-transparent"
                    style={{
                        backgroundImage: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--accent) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    GymTracker
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                    Track your fitness journey
                </p>
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
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                                    style={{
                                        backgroundColor: active ? 'var(--brand-primary)' : 'transparent',
                                        color: active ? 'white' : 'var(--text-primary)',
                                    }}
                                    whileHover={{
                                        backgroundColor: active ? undefined : 'var(--bg-tertiary)',
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="text-xl">{menu.icon}</span>
                                    <span className="font-medium">{menu.name}</span>
                                </motion.button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Action Button */}
            {actionButton && (
                <div className="p-4 border-t" style={{ borderColor: 'var(--border-default)' }}>
                    <motion.button
                        onClick={actionButton.onClick}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200"
                        style={{
                            background: actionButton.danger
                                ? 'var(--semantic-error)'
                                : 'linear-gradient(135deg, var(--brand-primary) 0%, var(--accent) 100%)',
                            color: 'white',
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="text-lg">{actionButton.icon}</span>
                        <span>{actionButton.label}</span>
                    </motion.button>
                </div>
            )}

            {/* Theme Toggle */}
            <div className="p-4 flex justify-center">
                <ThemeToggle />
            </div>
        </div>
    );
};
