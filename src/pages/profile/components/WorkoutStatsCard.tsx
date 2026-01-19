import { useTranslation } from "react-i18next";

interface WorkoutStatsCardProps {
    workoutCount: number;
}

export const WorkoutStatsCard = ({ workoutCount }: WorkoutStatsCardProps) => {
    const { t } = useTranslation();

    return (
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-950 dark:to-neutral-900 rounded-2xl p-6">
            <div className="text-center">
                <p className="text-neutral-400 text-sm uppercase tracking-wider mb-2">
                    {t("profile.workouts")}
                </p>
                <p className="text-white text-4xl font-bold">
                    {workoutCount}
                </p>
            </div>
        </div>
    );
};
