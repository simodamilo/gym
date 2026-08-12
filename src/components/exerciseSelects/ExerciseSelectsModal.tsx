import { useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState } from "../../store";
import type { ExerciseCatalog } from "../../store/exercisesCatalog/types";
import { exercisesSelectors } from "../../store/exercisesCatalog/exercisesCatalog.selector";
import { CustomModal } from "../customModal";
import { ExerciseSelects } from "./ExerciseSelects";

interface ExerciseSelectsModalProps {
    selectedExercise?: ExerciseCatalog;
    onChange: (exerciseId?: string) => void;
    isReadOnly?: boolean;
}

/**
 * The category/exercise pair behind a button rather than inline, so an exercise card stays
 * compact. The choice is staged while the modal is open and only reported on confirm, which
 * keeps a cancelled edit from clearing the exercise that was already set.
 */
export const ExerciseSelectsModal = ({ selectedExercise, onChange, isReadOnly }: ExerciseSelectsModalProps) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [stagedExercise, setStagedExercise] = useState<ExerciseCatalog | undefined>(selectedExercise);

    const exercises: ExerciseCatalog[] = useSelector((state: RootState) => exercisesSelectors.getExercises(state));

    useEffect(() => {
        setStagedExercise(selectedExercise);
    }, [selectedExercise]);

    const openModal = () => {
        setStagedExercise(selectedExercise);
        setIsOpen(true);
    };

    const confirm = () => {
        onChange(stagedExercise?.id);
        setIsOpen(false);
    };

    const cancel = () => {
        setStagedExercise(selectedExercise);
        setIsOpen(false);
    };

    const label = selectedExercise ? selectedExercise.name[0].toUpperCase() + selectedExercise.name.slice(1) : t("workouts.exercises.select_exercise");

    return (
        <>
            <motion.button
                disabled={isReadOnly}
                onClick={openModal}
                className="w-full min-h-10 px-4 py-2 rounded-xl flex items-center justify-between gap-3 border cursor-pointer shadow-var-sm bg-[var(--bg-elevated)] border-[var(--border-default)] disabled:cursor-not-allowed disabled:opacity-60"
                whileHover={{ scale: isReadOnly ? 1 : 1.01 }}
                whileTap={{ scale: isReadOnly ? 1 : 0.99 }}
                transition={{ duration: 0.2 }}
            >
                <span className={`text-left text-sm font-medium ${selectedExercise ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"}`}>{label}</span>
                <EditOutlined className="text-[var(--text-tertiary)] flex-shrink-0" />
            </motion.button>

            <CustomModal open={isOpen} type="edit" title={t("workouts.exercises.select_exercise")} onOk={confirm} onCancel={cancel}>
                <ExerciseSelects selectedExercise={stagedExercise} onChange={(exerciseId) => setStagedExercise(exercises.find((exercise) => exercise.id === exerciseId))} />
            </CustomModal>
        </>
    );
};
