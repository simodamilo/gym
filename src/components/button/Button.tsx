interface ButtonProps {
    onClick: () => void;
    label: string;
    active?: boolean;
    disabled?: boolean;
    className?: string;
}

export const Button = ({ onClick, label, active, disabled, className = '' }: ButtonProps) => {
    const getBackgroundClass = () => {
        if (disabled) return '';
        if (active) return 'bg-white';
        return 'bg-[conic-gradient(from_80deg,transparent_0deg,var(--secondary-color)_0deg,var(--white-color)_12deg,var(--white-color)_168deg,var(--secondary-color)_180deg,transparent_180deg),conic-gradient(from_260deg,transparent_0deg,var(--secondary-color)_0deg,var(--white-color)_12deg,var(--white-color)_168deg,var(--secondary-color)_180deg,transparent_180deg)]';
    };

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`flex items-center rounded-lg justify-center transition-all duration-300 ease-out relative overflow-hidden group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed p-[2px] w-full ${getBackgroundClass()} ${className}`}
            aria-label="Icon button"
        >
            <div className={`w-full h-full ${disabled ? "bg-[rgba(36,36,36,0.5)]" : "bg-[rgba(36,36,36,0.9)]"} rounded-md flex items-center justify-center py-2 px-4`}>
                <span className="text-[var(--white-color)] text-sm font-medium">{label}</span>
            </div>
        </button>
    );
};
