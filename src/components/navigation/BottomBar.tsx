import { LogoutOutlined, PlayCircleOutlined, PlusOutlined, UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { routes } from "../../utils/routing/routes";
import { supabase } from "../../store/supabaseClient";
import { exercisesCatalogActions } from "../../store/exercisesCatalog/exercisesCatalog.action";
import { useAppDispatch } from "../../store";
import { currentActions } from "../../store/current/current.actions";

const menus: MenuItem[] = [
    { name: "Profile", icon: <UserOutlined />, path: "/gym/profile" },
    { name: "Workout", icon: <PlayCircleOutlined />, path: "/gym/workouts" },
    { name: "Exercise", icon: <UnorderedListOutlined />, path: "/gym/exercises" },
];

interface MenuItem {
    name: string;
    icon: React.ReactNode;
    path: string;
}

export const BottomBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [active, setActive] = useState(1);

    // Update active state based on current route
    useEffect(() => {
        const path = location.pathname;
        if (path.startsWith("/gym/profile")) {
            setActive(0);
        } else if (path.startsWith("/gym/workouts")) {
            setActive(1);
        } else if (path.startsWith("/gym/exercises")) {
            setActive(2);
        }
    }, [location.pathname]);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Logout error:", error.message);
        }
    };

    const handleActionButtonClick = () => {
        switch (active) {
            case 0:
                handleLogout();
                break;
            case 1:
                navigate(routes.workoutsCreate);
                dispatch(currentActions.showSwitcher(false));
                break;
            case 2:
                dispatch(exercisesCatalogActions.manageCreateModal(true));
                break;
        }
    };

    const getActionButtonIcon = () => {
        switch (active) {
            case 0:
                return <LogoutOutlined />;
            case 1:
                return <PlusOutlined />;
            case 2:
                return <PlusOutlined />;
            default:
                return <PlusOutlined />;
        }
    };

    const handleItemClick = (index: number) => {
        setActive(index);
        navigate(menus[index].path);
    };

    return (
        <div
            className="fixed bottom-6 left-4 right-4 md:hidden z-[9998] h-[72px] rounded-4xl flex items-center px-3 gap-3 bg-bg-elevated/95 backdrop-blur-xl border border-border-default shadow-var-xl"
        >
            {/* Navigation Icons */}
            <div className="flex items-center gap-2 flex-1">
                {menus.map((menu, index) => (
                    <motion.div
                        key={menu.path}
                        onClick={() => handleItemClick(index)}
                        className={`flex flex-col items-center justify-center cursor-pointer px-4 py-2 rounded-xl flex-1 ${active === index ? "bg-bg-secondary" : "bg-transparent"}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className={`text-xl mb-1 transition-colors duration-200 ${active === index ? "text-brand-primary" : "text-text-tertiary"}`}>{menu.icon}</span>
                        <span className={`text-[10px] font-semibold transition-colors duration-200 ${active === index ? "text-brand-primary" : "text-text-tertiary"}`}>{menu.name}</span>
                    </motion.div>
                ))}
            </div>

            {/* Vertical Divider */}
            <div className="w-px h-10 flex-shrink-0 border-l border-border-default bg-border-default" />

            {/* Action Button */}
            <div className="flex items-center justify-end w-14 pr-1">
                <motion.button
                    className={`h-[42px] w-[42px] rounded-full flex items-center justify-center flex-shrink-0 shadow-var-md ${active === 0 ? "bg-semantic-error" : "bg-gradient-to-br from-brand-primary to-[var(--accent)]"}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleActionButtonClick}
                >
                    <span className="text-white text-l">{getActionButtonIcon()}</span>
                </motion.button>
            </div>
        </div>
    );
};
