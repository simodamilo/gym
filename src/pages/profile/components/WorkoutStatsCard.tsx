import { useTranslation } from "react-i18next";

interface WorkoutStatsCardProps {
    workoutCount: number;
}

export const WorkoutStatsCard = ({ workoutCount }: WorkoutStatsCardProps) => {
    const { t } = useTranslation();

    return (
        <div className="bg-[var(--bg-profile-card)] shadow-var-md rounded-2xl p-6">
            <div className="text-center">
                <p className="text-[var(--text-secondary)] text-sm uppercase tracking-wider mb-2">
                    {t("profile.workouts")}
                </p>
                <p className="text-[var(--text-primary)] text-4xl font-bold">
                    {workoutCount}
                </p>
            </div>
        </div>
    );
};
