import { useEffect, useState } from "react";
import useDarkMode from "../../utils/hooks/useDarkMode";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";

export default function DarkModeToggle() {
    const [isDark, setIsDark] = useDarkMode();
    const [active, setActive] = useState<string>();

    useEffect(() => {
        setActive(isDark ? 'dark' : 'light')
    }, [isDark]);

    const items = [
        {
            key: "dark",
            label: <MoonOutlined />,
        },
        {
            key: "light",
            label: <SunOutlined />,
        },
    ];

    return (
        <div className="flex w-[100px] rounded-full bg-[var(--black-color)] p-1 h-10">
            {items.map(({ key, label }) => (
                <div
                    key={key}
                    className={`flex-1 h-8 cursor-pointer rounded-full py-1 text-center font-medium text-[var(--white-color)] transition-all duration-300 ease-in-out ${active === key ? "bg-[var(--secondary-color)] !text-[var(--white-color)] shadow-md" : ""}`}
                    onClick={() => setIsDark(!isDark)}
                >
                    {label}
                </div>
            ))}
        </div>
    );
}