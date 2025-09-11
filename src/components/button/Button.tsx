interface ButtonProps {
    onClick: () => void;
    label: string;
    active?: boolean;
    disabled?: boolean;
}

export const Button = ({ onClick, label, active, disabled }: ButtonProps) => {
    const borderStyle = active
        ? "white"
        : `conic-gradient(
             from 80deg, transparent 0deg, #242424 0deg, white 12deg, white 168deg, #242424 180deg, transparent 180deg),
           conic-gradient(
             from 260deg, transparent 0deg, #242424 0deg, white 12deg,  white 168deg, #242424 180deg, transparent 180deg)`;

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`flex items-center rounded-md justify-center transition-all duration-300 ease-out relative overflow-hidden group active:scale-95`}
            style={{
                background: disabled ? undefined : borderStyle,
                padding: "2px",
                transition: "background 1s ease-out ease-in",
                width: "100%",
            }}
            aria-label="Icon button"
        >
            <div className={`w-full h-full bg-[${disabled ? "rgba(36,36,36,0.5)" : "rgba(36,36,36,0.9)"}] rounded-md flex items-center justify-center py-1 px-2`}>
                <span className="text-white text-sm font-bold">{label}</span>
            </div>
        </button>
    );
};
