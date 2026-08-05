import { useTranslation } from "react-i18next";
import { getSetGrid, hasSeparateWeight } from "./setRow.styles";

interface SetRowHeaderProps {
    repsType?: string;
    unitLabel?: string;
}

/**
 * Rendered once per exercise, not once per set. Hoisting the static labels out of the rows is what
 * buys the target its own column for free: the header costs ~18px once, while a per-row caption
 * would cost ~32px on every set.
 *
 * Uppercase at 11px reads as a table header rather than as data, so it never competes with the
 * numbers below it.
 */
export const SetRowHeader = ({ repsType, unitLabel }: SetRowHeaderProps) => {
    const { t } = useTranslation();

    const headerClass = "text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)] truncate";
    const showWeight = hasSeparateWeight(repsType);

    return (
        <div className={`${getSetGrid(repsType)} items-end pb-1`}>
            <span className={`${headerClass} text-center`}>{t("workouts.exercises.col_set")}</span>
            <span className={`${headerClass} text-center`}>{t("workouts.exercises.col_target")}</span>
            {/* Without a separate weight the single value column carries the unit itself,
                so the label comes from getAddon() rather than from a reps/secs key. */}
            <span className={`${headerClass} px-1`}>{showWeight ? t("workouts.exercises.col_performed_reps") : unitLabel}</span>
            {showWeight && <span className={`${headerClass} px-1`}>{unitLabel}</span>}
        </div>
    );
};
