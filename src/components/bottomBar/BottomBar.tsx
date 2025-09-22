import { PlayCircleOutlined, PlusOutlined, UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { routes } from "../../utils/routing/routes";

const menus: MenuItem[] = [
    { name: "Profile", icon: <UserOutlined />, path: "/gym/profile", xPosition: 0 },
    { name: "Workout", icon: <PlayCircleOutlined />, path: "/gym/workouts", xPosition: 0 },
    { name: "Exercise", icon: <UnorderedListOutlined />, path: "/gym/exercises", xPosition: 0 },
];

interface MenuItem {
    name: string;
    icon: React.ReactNode;
    path: string;
    xPosition: number;
}

export const BottomBar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [active, setActive] = useState(0);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const menuRef = useRef<HTMLUListElement>(null);

    const controls = useAnimation();

    // Used to calculate position of each item
    useEffect(() => {
        const updatePositions = () => {
            const containerWidth = menuRef.current?.offsetWidth ?? 0;
            setMenuItems(
                menus.map((menu) => {
                    switch (menu.name) {
                        case "Profile":
                            return { ...menu, xPosition: 4 };
                        case "Workout":
                            return { ...menu, xPosition: containerWidth / 2 - 32 };
                        case "Exercise":
                            return { ...menu, xPosition: containerWidth - 68 };
                        default:
                            return menu;
                    }
                })
            );
        };

        updatePositions();

        const resizeObserver = new ResizeObserver(updatePositions);
        if (menuRef.current) {
            resizeObserver.observe(menuRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    // used to set active tab from navigation
    useEffect(() => {
        const containerWidth = menuRef.current?.offsetWidth;
        switch (location.pathname) {
            case "/gym/profile":
                setActive(0);
                controls.start({ x: 4, transition: { type: "spring", stiffness: 300, damping: 30 } });
                break;
            case "/gym/workouts": {
                setActive(1);
                const newPos = containerWidth ? containerWidth / 2 - 32 : 4;
                controls.start({ x: newPos, transition: { type: "spring", stiffness: 300, damping: 30 } });
                break;
            }
            case "/gym/exercises": {
                setActive(2);
                const newPos = containerWidth ? containerWidth - 68 : 4;
                controls.start({ x: newPos, transition: { type: "spring", stiffness: 300, damping: 30 } });
                break;
            }
            default:
                setActive(1);
        }
    }, [controls, location.pathname]);

    // used to navigate to active tab
    useEffect(() => {
        const containerWidth = menuRef.current?.offsetWidth;
        switch (active) {
            case 0:
                navigate("/gym/profile");
                controls.start({ x: 4, transition: { type: "spring", stiffness: 300, damping: 30 } });
                break;
            case 1: {
                navigate("/gym/workouts");
                const newPos = containerWidth ? containerWidth / 2 - 32 : 4;
                controls.start({ x: newPos, transition: { type: "spring", stiffness: 300, damping: 30 } });
                break;
            }
            case 2: {
                navigate("/gym/exercises");
                const newPos = containerWidth ? containerWidth - 68 : 4;
                controls.start({ x: newPos, transition: { type: "spring", stiffness: 300, damping: 30 } });
                break;
            }
        }
    }, [active, controls, navigate]);

    const handleActionButtonClick = () => {
        switch (active) {
            case 0:
                break;
            case 1:
                navigate(routes.workoutsCreate);
                break;
            case 2:
                break;
        }
    };

    return (
        <>
            <div className="fixed h-18 bottom-8 left-4 right-26 width-full md:hidden z-9998 backdrop-blur-sm bg-white/10 border border-white/20 rounded-[36px] shadow-lg">
                <motion.div
                    drag="x"
                    dragConstraints={menuRef}
                    whileTap={{ scale: 1.2, borderRadius: "16px", opacity: 0.9, border: "1px solid white", backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                    className="z-9999 absolute h-16 w-16 rounded-full bg-white/40 top-[3px]"
                    animate={controls}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onDragEnd={(_, info) => {
                        if (!menuRef.current) return;

                        const items = menuRef.current.querySelectorAll("li");
                        let closestIndex = 0;
                        let closestDistance = Infinity;

                        items.forEach((item, index) => {
                            const rect = item.getBoundingClientRect();
                            const center = rect.left + rect.width / 2;
                            const distance = Math.abs(info.point.x - center);
                            if (distance < closestDistance) {
                                closestDistance = distance;
                                closestIndex = index;
                            }
                        });

                        const newKnobPos = menuItems[closestIndex]?.xPosition ?? 0;

                        // always animate to the new position
                        controls.start({ x: newKnobPos, transition: { type: "spring", stiffness: 300, damping: 30 } });

                        // update active for highlighting/navigation
                        if (closestIndex !== active) {
                            setActive(closestIndex);
                        }
                    }}
                />

                <ul className="flex relative w-full justify-between px-3" ref={menuRef}>
                    {menus.map((menu, index) => (
                        <li key={index} className="w-12 h-17.5 flex flex-col items-center justify-center">
                            <span onClick={() => setActive(index)} className={`text-[var(--white-color)] z-100 text-xl cursor-pointer duration-500`}>
                                {menu.icon}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div
                className="fixed z-9999 flex justify-around m-auto h-18 w-18 bottom-8 right-4 p-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-[36px]"
                onClick={handleActionButtonClick}
            >
                <PlusOutlined className="text-2xl" />
            </div>
        </>
    );
};
