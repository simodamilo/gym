import { LogoutOutlined, PlayCircleOutlined, PlusOutlined, UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { routes } from "../../utils/routing/routes";
import { supabase } from "../../store/supabaseClient";
import { exercisesCatalogActions } from "../../store/exercisesCatalog/exercisesCatalog.action";
import { useAppDispatch } from "../../store";

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
    const [pillX, setPillX] = useState(0);
    const [pillWidth, setPillWidth] = useState(52);
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

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

    // Update pill position and width when active changes
    useEffect(() => {
        const updatePillPosition = () => {
            const activeItem = itemRefs.current[active];
            const container = containerRef.current;

            if (activeItem && container) {
                const containerRect = container.getBoundingClientRect();
                const itemRect = activeItem.getBoundingClientRect();

                // Get the left position of the item relative to container
                const itemLeft = itemRect.left - containerRect.left;

                // Use the item's width as the pill width
                const itemWidth = itemRect.width;

                // Add padding inside the pill for comfortable fit
                const pillInnerPadding = 4;
                const newPillWidth = itemWidth - pillInnerPadding * 2;

                // Center the pill over the item with padding
                const x = itemLeft + pillInnerPadding;

                setPillX(x);
                setPillWidth(newPillWidth);
            }
        };

        updatePillPosition();

        // Add slight delay for initial render
        const timer = setTimeout(updatePillPosition, 50);

        window.addEventListener("resize", updatePillPosition);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", updatePillPosition);
        };
    }, [active]);

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

    const handleDragEnd = (_: MouseEvent, info: PanInfo) => {
        if (!containerRef.current) return;

        let closestIndex = 0;
        let closestDistance = Infinity;

        itemRefs.current.forEach((item, index) => {
            if (item) {
                const rect = item.getBoundingClientRect();
                const center = rect.left + rect.width / 2;
                const distance = Math.abs(info.point.x - center);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            }
        });

        if (closestIndex !== active) {
            handleItemClick(closestIndex);
        }
    };

    return (
        <>
            {/* Main Navigation Bar - Mobile Only */}
            <div
                ref={containerRef}
                className="fixed bottom-6 left-4 right-[88px] md:hidden z-[9998] h-[60px] rounded-[30px] flex items-center"
                style={{
                    backgroundColor: "var(--bg-elevated)",
                    border: "1px solid var(--border-default)",
                    boxShadow: "var(--shadow-lg)",
                }}
            >
                {/* Draggable Indicator Pill */}
                <motion.div
                    drag="x"
                    dragConstraints={containerRef}
                    dragElastic={0.1}
                    onDragEnd={handleDragEnd}
                    className="absolute h-[52px] rounded-full cursor-grab active:cursor-grabbing"
                    style={{
                        background: "linear-gradient(135deg, var(--brand-primary) 0%, var(--accent) 100%)",
                        left: `${pillX}px`,
                        width: `${pillWidth}px`,
                    }}
                    animate={{
                        left: pillX,
                        width: pillWidth,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    whileTap={{ scale: 1.05 }}
                />

                {/* Menu Items */}
                <div className="flex w-full justify-around items-center relative z-10 px-0">
                    {menus.map((menu, index) => (
                        <div
                            key={menu.path}
                            ref={(el) => {
                                itemRefs.current[index] = el;
                            }}
                            onClick={() => handleItemClick(index)}
                            className="flex flex-col items-center justify-center gap-0.5 cursor-pointer w-[85px]"
                        >
                            <span className={`text-xl transition-colors duration-200 ${active === index ? "text-white" : "text-[var(--text-tertiary)]"}`}>{menu.icon}</span>
                            <span className={`text-[10px] font-medium transition-colors duration-200 ${active === index ? "text-white" : "text-[var(--text-tertiary)]"}`}>{menu.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Button (FAB) - Mobile Only */}
            <motion.button
                className="md:hidden fixed bottom-6 right-4 z-[9999] h-[60px] w-[60px] rounded-full flex items-center justify-center shadow-lg"
                style={{
                    background: active === 0 ? "var(--semantic-error)" : "linear-gradient(135deg, var(--brand-primary) 0%, var(--accent) 100%)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleActionButtonClick}
            >
                <span className="text-white text-2xl">{getActionButtonIcon()}</span>
            </motion.button>
        </>
    );
};
