interface ButtonProps {
    onClick: () => void;
    label: string;
    active?: boolean;
    disabled?: boolean;
}

export const Button = ({ onClick, label, active, disabled }: ButtonProps) => {
    const getBackgroundClass = () => {
        if (disabled) return '';
        if (active) return 'bg-white';
        return 'bg-[conic-gradient(from_80deg,transparent_0deg,var(--secondary-color)_0deg,var(--white-color)_12deg,var(--white-color)_168deg,var(--secondary-color)_180deg,transparent_180deg),conic-gradient(from_260deg,transparent_0deg,var(--secondary-color)_0deg,var(--white-color)_12deg,var(--white-color)_168deg,var(--secondary-color)_180deg,transparent_180deg)]';
    };

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`flex items-center rounded-md justify-center transition-all duration-300 ease-out relative overflow-hidden group active:scale-95 p-[2px] w-full ${getBackgroundClass()}`}
            style={{
                transition: "background 1s ease-out ease-in",
            }}
            aria-label="Icon button"
        >
            <div className={`w-full h-full ${disabled ? "bg-[rgba(36,36,36,0.5)]" : "bg-[rgba(36,36,36,0.9)]"} rounded-md flex items-center justify-center py-1 px-2`}>
                <span className="text-[var(--white-color)] text-sm font-bold">{label}</span>
            </div>
        </button>
    );
};
