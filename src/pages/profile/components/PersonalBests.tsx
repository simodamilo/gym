import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { personalBestsSelectors } from "../../../store/personalBests/personalBests.selectors";

export const PersonalBests = () => {
    const { t } = useTranslation();
    const personalBests = useSelector(personalBestsSelectors.getPersonalBests);
    const isLoading = useSelector(personalBestsSelectors.getIsLoading);
    const isError = useSelector(personalBestsSelectors.getIsError);

    return (
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-950 dark:to-neutral-900 rounded-2xl p-6">
            {/* Header */}
            <p className="text-neutral-400 text-sm uppercase tracking-wider mb-4">
                {t("profile.personal_bests")}
            </p>

            {/* Loading State */}
            {isLoading && (
                <div className="text-center py-8">
                    <p className="text-neutral-500 text-sm">
                        {t("profile.loading")}
                    </p>
                </div>
            )}

            {/* Error State */}
            {isError && !isLoading && (
                <div className="text-center py-8">
                    <p className="text-red-500 text-sm">
                        {t("profile.error_loading_personal_bests")}
                    </p>
                </div>
            )}

            {/* Personal Bests List */}
            {!isLoading && !isError && personalBests.length > 0 && (
                <div className="space-y-3">
                    {personalBests.map((pb) => (
                        <div
                            key={pb.exerciseId}
                            className="flex justify-between items-center py-2 border-b border-neutral-700/50 last:border-b-0"
                        >
                            <span className="text-white text-base">
                                {pb.exerciseName}
                            </span>
                            <span className="text-white text-base font-semibold">
                                {pb.maxWeight.toFixed(1)} kg
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && personalBests.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-neutral-500 text-sm">
                        {t("profile.no_personal_bests")}
                    </p>
                </div>
            )}
        </div>
    );
};
