import { Modal } from "antd";
import { TrophyOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState } from "../../../store";
import { exercisesSelectors } from "../../../store/exercisesCatalog/exercisesCatalog.selector";
import { ExercisePicker } from "../../../components/exerciseSelects/ExercisePicker";
import { WeightInput } from "../../../components/weightInput/WeightInput";
import type { ExerciseCatalog } from "../../../store/exercisesCatalog/types";

interface AddPersonalBestModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (exerciseId: string, weight: number) => void;
    isLoading?: boolean;
}

export const AddPersonalBestModal = ({
    open,
    onClose,
    onSave,
    isLoading = false,
}: AddPersonalBestModalProps) => {
    const { t } = useTranslation();
    const [selectedExerciseId, setSelectedExerciseId] = useState<string>();
    const [weight, setWeight] = useState<number>(20);
    const [errors, setErrors] = useState<{ exercise?: string; weight?: string }>({});

    const exercises: ExerciseCatalog[] = useSelector((state: RootState) =>
        exercisesSelectors.getExercises(state)
    );

    // Find selected exercise object
    const selectedExercise = exercises.find((ex) => ex.id === selectedExerciseId);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!open) {
            setSelectedExerciseId(undefined);
            setWeight(20);
            setErrors({});
        }
    }, [open]);

    const validate = (): boolean => {
        const newErrors: { exercise?: string; weight?: string } = {};

        if (!selectedExerciseId) {
            newErrors.exercise = t("profile.add_pr_modal.error_exercise_required");
        }

        if (!weight || weight < 0.5) {
            newErrors.weight = t("profile.add_pr_modal.error_weight_min");
        } else if (weight > 999.9) {
            newErrors.weight = t("profile.add_pr_modal.error_weight_max");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validate() && selectedExerciseId) {
            onSave(selectedExerciseId, weight);
        }
    };

    const handleExerciseChange = (exerciseId?: string) => {
        setSelectedExerciseId(exerciseId);
        if (exerciseId) {
            setErrors((prev) => ({ ...prev, exercise: undefined }));
        }
    };

    const handleWeightChange = (newWeight: number) => {
        setWeight(newWeight);
        if (newWeight >= 0.5 && newWeight <= 999.9) {
            setErrors((prev) => ({ ...prev, weight: undefined }));
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            closable={false}
            centered
            styles={{
                content: {
                    backgroundColor: "var(--bg-elevated)",
                    borderRadius: "20px",
                    padding: "0",
                    overflow: "hidden",
                },
                mask: {
                    backdropFilter: "blur(8px)",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
            }}
        >
            <div className="px-6 pt-8 pb-6 flex flex-col gap-5 max-[480px]:px-5 max-[480px]:pt-6 max-[480px]:pb-5">
                {/* Icon Header */}
                <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 max-[480px]:w-14 max-[480px]:h-14">
                        <TrophyOutlined className="text-[32px] text-purple-400 max-[480px]:text-[28px]" />
                    </div>
                    <h3 className="m-0 text-xl font-semibold text-[var(--text-primary)] text-center leading-snug max-[480px]:text-lg">
                        {t("profile.add_pr_modal.title")}
                    </h3>
                </div>

                {/* Exercise Selection */}
                <div className="w-full">
                    <ExercisePicker
                        selectedExercise={selectedExercise}
                        onChange={(exercise) => handleExerciseChange(exercise?.id)}
                        isReadOnly={isLoading}
                    />
                    {errors.exercise && (
                        <p className="text-red-500 text-sm mt-1" role="alert">
                            {errors.exercise}
                        </p>
                    )}
                </div>

                {/* Weight Input */}
                <WeightInput
                    value={weight}
                    onChange={handleWeightChange}
                    disabled={isLoading}
                    error={errors.weight}
                    min={0.5}
                    max={999.9}
                    step={0.5}
                />

                {/* Buttons */}
                <div className="flex gap-3 w-full mt-2">
                    <motion.button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 h-11 rounded-xl border-none text-[15px] font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-light)] hover:bg-[var(--bg-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed max-[480px]:h-10 max-[480px]:text-sm"
                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    >
                        {t("profile.add_pr_modal.cancel")}
                    </motion.button>
                    <motion.button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex-1 h-11 rounded-xl border-none text-[15px] font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center text-white bg-gradient-to-br from-purple-500 to-blue-500 shadow-[0_4px_12px_rgba(147,51,234,0.3)] hover:shadow-[0_6px_16px_rgba(147,51,234,0.4)] disabled:opacity-50 disabled:cursor-not-allowed max-[480px]:h-10 max-[480px]:text-sm"
                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    >
                        {isLoading ? t("profile.add_pr_modal.saving") : t("profile.add_pr_modal.save")}
                    </motion.button>
                </div>
            </div>
        </Modal>
    );
};
