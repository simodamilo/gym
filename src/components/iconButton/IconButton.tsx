import type React from "react";
import { useMemo, type SyntheticEvent } from "react";

interface IconButtonProps {
    onClick: (e: SyntheticEvent) => void;
    icon: React.ReactNode;
    active?: boolean;
    size?: "SMALL" | "LARGE";
    disabled?: boolean;
}

export const IconButton = ({ onClick, icon, active, size, disabled }: IconButtonProps) => {
    const sizeStyle = useMemo(() => {
        return size === "SMALL" ? "w-9 h-9 min-w-9" : "w-10 h-10 min-w-10";
    }, [size]);

    const getBackgroundClass = () => {
        if (disabled) return '';
        if (active) return 'bg-white';
        return 'bg-[conic-gradient(from_60deg,transparent_0deg,var(--secondary-color)_0deg,var(--white-color)_90deg,var(--secondary-color)_180deg,transparent_180deg),conic-gradient(from_240deg,transparent_0deg,var(--secondary-color)_0deg,var(--white-color)_90deg,var(--secondary-color)_180deg,transparent_180deg)]';
    };

    return (
        <button
            disabled={disabled}
            onClick={(e) => onClick(e)}
            className={`${sizeStyle} rounded-3xl flex items-center justify-center transition-all duration-300 ease-out relative overflow-hidden group active:scale-95 p-px ${getBackgroundClass()}`}
            style={{
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
