import type React from "react";
import { useMemo } from "react";

interface IconButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    active?: boolean;
    size?: "SMALL" | "LARGE";
    disabled?: boolean;
}

export const IconButton = ({ onClick, icon, active, size, disabled }: IconButtonProps) => {
    const sizeStyle = useMemo(() => {
        return size === "SMALL" ? "w-9 h-9 min-w-9" : "w-10 h-10 min-w-10";
    }, [size]);

    const borderStyle = active
        ? "white"
        : `conic-gradient(
             from 60deg, transparent 0deg, var(--secondary-color) 0deg, var(--white-color) 90deg, var(--secondary-color) 180deg, transparent 180deg),
           conic-gradient(
             from 240deg, transparent 0deg, var(--secondary-color) 0deg, var(--white-color) 90deg, var(--secondary-color) 180deg, transparent 180deg)`;

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`${sizeStyle} rounded-3xl flex items-center justify-center transition-all duration-300 ease-out relative overflow-hidden group active:scale-95`}
            style={{
                background: disabled ? undefined : borderStyle,
                padding: "2px",
                transition: "background 1s ease-out ease-in",
            }}
            aria-label="Icon button"
        >
            <div className={`w-full h-full ${disabled ? "bg-[rgba(36,36,36,0.5)]" : "bg-[rgba(36,36,36,0.9)]"} rounded-2xl flex items-center justify-center`}>
                <span className="text-[var(--white-color)]">{icon}</span>
            </div>
        </button>
    );
};
