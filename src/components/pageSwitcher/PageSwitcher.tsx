import { useTranslation } from "react-i18next";

interface IProps {
    active: string;
    onChange: (key: string) => void;
}

export const PageSwitcher = ({ active, onChange }: IProps) => {
    const { t } = useTranslation();

    const items = [
        {
            key: "current",
            label: t("workouts.current_tab"),
        },
        {
            key: "history",
            label: t("workouts.history_tab"),
        },
    ];

    return (
        <div className="flex w-full rounded-full bg-[var(--primary-color)] p-1 h-10">
            {items.map(({ key, label }) => (
                <div
                    key={key}
                    className={`flex-1 h-8 cursor-pointer rounded-full py-1 text-center font-medium text-[var(--white-color)] transition-all duration-300 ease-in-out ${
                        active === key ? "bg-[var(--secondary-color)] !text-[var(--black-color)] shadow-md" : ""
                    }`}
                    onClick={() => onChange(key)}
                >
                    {label}
                </div>
            ))}
        </div>
    );
};
