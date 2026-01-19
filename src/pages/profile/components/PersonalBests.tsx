import { useTranslation } from "react-i18next";

interface PersonalBest {
    exercise: string;
    weight: number;
}

// TODO: Replace with actual 1RM calculation logic
const MOCK_PERSONAL_BESTS: PersonalBest[] = [
    { exercise: "Back Squat", weight: 126.0 },
    { exercise: "Deadlift", weight: 146.0 },
    { exercise: "Bench Press", weight: 95.0 },
];

export const PersonalBests = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-950 dark:to-neutral-900 rounded-2xl p-6">
            {/* Header */}
            <p className="text-neutral-400 text-sm uppercase tracking-wider mb-4">
                {t("profile.personal_bests")}
            </p>

            {/* Personal Bests List */}
            <div className="space-y-3">
                {MOCK_PERSONAL_BESTS.map((pb, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-neutral-700/50 last:border-b-0"
                    >
                        <span className="text-white text-base">
                            {pb.exercise}
                        </span>
                        <span className="text-white text-base font-semibold">
                            {pb.weight.toFixed(1)} kg
                        </span>
                    </div>
                ))}
            </div>

            {/* Empty State - Comment out when real data is available */}
            {MOCK_PERSONAL_BESTS.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-neutral-500 text-sm">
                        {t("profile.no_personal_bests")}
                    </p>
                </div>
            )}
        </div>
    );
};
