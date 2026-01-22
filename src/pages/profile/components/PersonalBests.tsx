import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { notification } from "antd";
import { personalBestsSelectors } from "../../../store/personalBests/personalBests.selectors";
import { personalBestsActions } from "../../../store/personalBests/personalBests.actions";
import { AddPersonalBestModal } from "./AddPersonalBestModal";
import type { AppDispatch } from "../../../store";

export const PersonalBests = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const personalBests = useSelector(personalBestsSelectors.getPersonalBests);
    const isLoading = useSelector(personalBestsSelectors.getIsLoading);
    const isError = useSelector(personalBestsSelectors.getIsError);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleAddPR = async (exerciseId: string, weight: number) => {
        setIsSaving(true);
        try {
            // Check if this exercise already has a manual PR
            // Note: manualId can exist even when isManual=false (when workout PR is higher)
            const existingManualPR = personalBests.find(
                (pb) => pb.exerciseId === exerciseId && pb.manualId
            );

            if (existingManualPR && existingManualPR.manualId) {
                // Update existing manual PR
                await dispatch(
                    personalBestsActions.updateManualPersonalBest({
                        id: existingManualPR.manualId,
                        weight,
                    })
                ).unwrap();
            } else {
                // Add new manual PR
                await dispatch(
                    personalBestsActions.addManualPersonalBest({ exerciseId, weight })
                ).unwrap();
            }

            notification.success({
                message: t("profile.add_pr_modal.success_title"),
                description: t("profile.add_pr_modal.success_message"),
                placement: "bottomRight",
                duration: 3,
            });

            setIsModalOpen(false);
        } catch (error) {
            notification.error({
                message: t("profile.add_pr_modal.error_title"),
                description: t("profile.add_pr_modal.error_message"),
                placement: "bottomRight",
                duration: 4,
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-[var(--bg-profile-card)] shadow-var-md rounded-2xl p-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-[var(--text-secondary)] text-sm uppercase tracking-wider">
                    {t("profile.personal_bests")}
                </p>
                <motion.button
                    onClick={() => setIsModalOpen(true)}
                    className="w-10 h-10 min-w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={t("profile.add_pr_button")}
                >
                    <PlusOutlined className="text-lg" />
                </motion.button>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="text-center py-8">
                    <p className="text-[var(--text-tertiary)] text-sm">
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
                            className="flex justify-between items-center py-2 border-b border-[var(--border-default)] last:border-b-0"
                        >
                            <span className="text-[var(--text-primary)] text-base">
                                {pb.exerciseName}
                            </span>
                            <div className="flex items-center gap-2">
                                {pb.isManual && (
                                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium">
                                        M
                                    </span>
                                )}
                                <span className="text-[var(--text-primary)] text-base font-semibold">
                                    {pb.maxWeight.toFixed(1)} kg
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && personalBests.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-[var(--text-tertiary)] text-sm">
                        {t("profile.no_personal_bests")}
                    </p>
                </div>
            )}

            {/* Add Personal Best Modal */}
            <AddPersonalBestModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddPR}
                isLoading={isSaving}
            />
        </div>
    );
};
