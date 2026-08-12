import { useMemo, useState } from "react";
import { PieChartOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import type { Day, DayExercise } from "../../store/draft/types";
import { getMuscleVolume, getWorkoutMuscleVolume } from "../../utils/volume";
import { IconButton } from "../iconButton/IconButton";
import { CustomModal } from "../customModal";
import { MuscleVolumeList } from "./MuscleVolumeList";

interface MuscleVolumeButtonProps {
    /** Workout level: every day is summed. Mutually exclusive with `dayExercises`. */
    days?: Day[];
    /** Day level. */
    dayExercises?: DayExercise[];
}

/**
 * Opens the per-muscle volume breakdown for either a whole workout or a single day.
 * Everything is derived from data already in the store, so there is nothing to fetch.
 */
export const MuscleVolumeButton = ({ days, dayExercises }: MuscleVolumeButtonProps) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const volumes = useMemo(() => (days ? getWorkoutMuscleVolume(days) : getMuscleVolume(dayExercises || [])), [days, dayExercises]);

    return (
        <>
            <IconButton icon={<PieChartOutlined />} onClick={() => setIsOpen(true)} />
            <CustomModal
                open={isOpen}
                type="info"
                hideCancel
                title={t(days ? "components.muscle_volume.workout_title" : "components.muscle_volume.day_title")}
                onOk={() => setIsOpen(false)}
                onCancel={() => setIsOpen(false)}
            >
                <MuscleVolumeList volumes={volumes} />
            </CustomModal>
        </>
    );
};
