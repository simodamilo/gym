import { PlayCircleOutlined, UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
    const [active, setActive] = useState(0);
    const menuRef = useRef<HTMLUListElement>(null);
    const [translateX, setTranslateX] = useState(0);
    const location = useLocation();

    const menus = [
        { name: "Profile", icon: <UserOutlined />, dis: "translate-x-0", path: "/profile" },
        { name: "Workout", icon: <PlayCircleOutlined />, dis: "translate-x-16", path: "/workouts" },
        { name: "Exercise", icon: <UnorderedListOutlined />, dis: "translate-x-32", path: "/exercises" },
    ];

    useEffect(() => {
        switch (location.pathname) {
            case "/profile":
                setActive(0);
                break;
            case "/workouts":
                setActive(1);
                break;
            case "/exercises":
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

                const center = itemRect.left + itemRect.width / 2 - containerRect.left;
                setTranslateX(center - 24);
            }
        }
    }, [active]);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-brand-primary dark:bg-white max-h-[3.4rem] width-full px-6 rounded-t-xl md:hidden">
            <ul className="flex relative w-full justify-between" ref={menuRef}>
                <span className={`bg-brand-primary h-12 w-12 absolute -top-6 rounded-full duration-700`} style={{ transform: `translateX(${translateX}px)` }}></span>
                {menus.map((menu, index) => (
                    <li key={index} className="w-12">
                        <Link to={menu.path} className="flex flex-col text-center pt-2" onClick={() => setActive(index)}>
                            <span className={`text-white z-100 text-xl cursor-pointer duration-500 ${index === active && "-mt-6"}`}>{menu.icon}</span>
                            <span className={`text-white text-xs mt-0.5 ${active === index ? "translate-y-4 duration-700 opacity-100" : "translate-y-10 opacity-0"}`}>{menu.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};
