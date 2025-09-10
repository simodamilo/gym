import type React from "react";

interface IconButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    active?: boolean;
}

export const IconButton = ({ onClick, icon, active }: IconButtonProps) => {
    const borderStyle = active
        ? "white"
        : `conic-gradient(
             from 60deg, transparent 0deg, #242424 0deg, white 90deg, #242424 180deg, transparent 180deg),
           conic-gradient(
             from 240deg, transparent 0deg, #242424 0deg, white 90deg, #242424 180deg, transparent 180deg)`;

    return (
        <button
            onClick={onClick}
            className="w-10 h-10 rounded-3xl flex items-center justify-center transition-all duration-300 ease-out relative overflow-hidden group active:scale-95"
            style={{
                background: borderStyle,
                padding: "2px",
                transition: "background 1s ease-out ease-in",
            }}
            aria-label="Icon button"
        >
            <div className="w-full h-full bg-[rgba(36,36,36,0.9)] rounded-2xl flex items-center justify-center">
                <span className="text-white">{icon}</span>
            </div>
        </button>
    );
};
