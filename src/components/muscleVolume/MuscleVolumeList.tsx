import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import type { MuscleVolume } from "../../utils/volume";
import { getTotalSets } from "../../utils/volume";

interface MuscleVolumeListProps {
    volumes: MuscleVolume[];
}

export const MuscleVolumeList = ({ volumes }: MuscleVolumeListProps) => {
    const { t } = useTranslation();

    if (volumes.length === 0) {
        return <p className="m-0 text-sm text-[var(--text-tertiary)]">{t("components.muscle_volume.empty")}</p>;
    }

    const total = getTotalSets(volumes);
    const hasExtra = total.extraSets > 0;
    /* Bars are scaled to the fullest muscle, extra sets included, so no bar overflows its track. */
    const scale = Math.max(...volumes.map((volume) => volume.sets + volume.extraSets));

    const setsLabel = (count: number) => t(count === 1 ? "components.muscle_volume.set_singular" : "components.muscle_volume.set_plural");

    return (
        <div className="w-full flex flex-col gap-3 text-left">
            {volumes.map((volume, index) => (
                <div key={volume.category} className="flex flex-col gap-1">
                    <div className="flex items-baseline justify-between gap-3">
                        <span className="text-sm font-medium text-[var(--text-primary)]">{t(`components.muscle_volume.muscles.${volume.category}`)}</span>
                        <span className="text-sm text-[var(--text-secondary)] flex-shrink-0">
                            {volume.sets} {volume.extraSets > 0 && <span className="text-[var(--text-tertiary)]">(+{volume.extraSets}) </span>}
                            {setsLabel(volume.sets)}
                        </span>
                    </div>
                    <div className="h-2 w-full rounded-full overflow-hidden bg-[var(--bg-tertiary)] flex">
                        <motion.div
                            className="h-full bg-[var(--brand-primary)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(volume.sets / scale) * 100}%` }}
                            transition={{ duration: 0.4, delay: index * 0.04 }}
                        />
                        {volume.extraSets > 0 && (
                            <motion.div
                                className="h-full bg-[var(--brand-primary)] opacity-40"
                                initial={{ width: 0 }}
                                animate={{ width: `${(volume.extraSets / scale) * 100}%` }}
                                transition={{ duration: 0.4, delay: index * 0.04 }}
                            />
                        )}
                    </div>
                </div>
            ))}
            <div className="flex items-baseline justify-between gap-3 pt-2 border-t border-[var(--border-light)]">
                <span className="text-sm font-semibold text-[var(--text-primary)]">{t("components.muscle_volume.total")}</span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {total.sets} {hasExtra && <span className="text-[var(--text-tertiary)]">(+{total.extraSets}) </span>}
                    {setsLabel(total.sets)}
                </span>
            </div>
            {hasExtra && <p className="m-0 text-xs italic text-[var(--text-tertiary)]">{t("components.muscle_volume.extra_hint")}</p>}
        </div>
    );
};
