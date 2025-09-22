import { PlayCircleOutlined, UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export const BottomBar = () => {
    const [active, setActive] = useState(0);
    const menuRef = useRef<HTMLUListElement>(null);
    const [translateX, setTranslateX] = useState(0);
    const location = useLocation();
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const menus = [
        { name: "Profile", icon: <UserOutlined />, dis: "translate-x-0", path: "/gym/profile" },
        { name: "Workout", icon: <PlayCircleOutlined />, dis: "translate-x-16", path: "/gym/workouts" },
        { name: "Exercise", icon: <UnorderedListOutlined />, dis: "translate-x-32", path: "/gym/exercises" },
    ];

    useEffect(() => {
        switch (location.pathname) {
            case "/gym/profile":
                setActive(0);
                break;
            case "/gym/workouts":
                setActive(1);
                break;
            case "/gym/exercises":
                setActive(2);
                break;
            default:
                setActive(1);
        }
    }, [location.pathname]);

    useEffect(() => {
        if (menuRef.current) {
            const items = menuRef.current.querySelectorAll("li");
            if (items.length > 0) {
                const item = items[active];
                const itemRect = item.getBoundingClientRect();
                const containerRect = menuRef.current.getBoundingClientRect();

                const center = itemRect.left + itemRect.width / 2 - containerRect.left - 4; // 16 is the padding
                setTranslateX(center - 24);
            }
        }
    }, [active]);

    return (
        <div className="fixed h-14 bottom-4 left-4 right-20 width-full md:hidden z-9998 backdrop-blur-sm bg-white/10 border border-white/20 rounded-4xl shadow-lg">
            <ul className="flex relative w-full justify-between px-1" ref={menuRef}>
                <motion.span
                    drag="x"
                    dragConstraints={menuRef}
                    whileTap={{ scale: 1.2 }}
                    className="z-9999 absolute h-12 w-12 rounded-full bg-white/20 border border-white/40 shadow-lg"
                    animate={{ x: translateX }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}

                    onDragEnd={(e, info) => {
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

                        setActive(closestIndex);
                    }}
                />
                {menus.map((menu, index) => (
                    <li key={index} className="w-12 h-13.5 flex flex-col items-center justify-center">
                        <Link to={menu.path} className="flex flex-col text-center" onClick={() => setActive(index)}>
                            <span className={`text-[var(--white-color)] z-100 text-xl cursor-pointer duration-500`}>{menu.icon}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};
