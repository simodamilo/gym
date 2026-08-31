import { useTranslation } from "react-i18next";
import { formatSessionDate, getSetColumns, getUnitKeys, type ProgressionSession } from "./progression.utils";
import { formatProgressionCell } from "./progressionCell";

interface ExerciseProgressionTableProps {
    sessions: ProgressionSession[];
}

/**
 * Newest first, which is the opposite of the chart: here the user is reading, not following a
 * trend. Sets are laid out in fixed columns rather than as free-flowing text so that reading
 * *down* a column compares the same set across trainings, which is what makes a progression
 * legible at a glance.
 */
export const ExerciseProgressionTable = ({ sessions }: ExerciseProgressionTableProps) => {
    const { t } = useTranslation();

    const setColumns = getSetColumns(sessions);
    const unitKeys = getUnitKeys(sessions);
    /* One unit for the whole exercise is the normal case, and it belongs in the header rather
       than repeated on every cell. An exercise switched between reps and time mid-history has
       two, and then each cell has to carry its own or the numbers lie. */
    const sharedUnitKey = unitKeys.length === 1 ? unitKeys[0] : undefined;

    return (
        <div className="overflow-x-auto hide-scrollbar">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr>
                        <th className="text-left font-medium text-xs uppercase tracking-wide text-[var(--text-tertiary)] pb-2 pr-3 whitespace-nowrap">
                            {sharedUnitKey ? t(sharedUnitKey) : ""}
                        </th>
                        {setColumns.map((setNumber) => (
                            <th key={setNumber} className="text-right font-medium text-xs uppercase tracking-wide text-[var(--text-tertiary)] pb-2 pl-3 whitespace-nowrap">
                                {t("workouts.exercises.col_set")} {setNumber}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...sessions].reverse().map((session) => {
                        /* Only needed when the exercise changed unit mid-history; otherwise the
                           header carries it and the cells stay clean. */
                        const rowUnit = sharedUnitKey ? undefined : t(getUnitKeys([session])[0]);

                        return (
                        <tr key={session.sessionId} className="border-0 border-t border-solid border-[var(--border-default)]">
                            <td className="py-2 pr-3 whitespace-nowrap">
                                <span className="font-semibold text-[var(--text-primary)]">{formatSessionDate(session.startedAt)}</span>
                                <span className="ml-2 text-xs text-[var(--text-tertiary)]">#{session.ordinal}</span>
                            </td>
                            {setColumns.map((setNumber) => {
                                const set = session.sets.find((current) => current.setNumber === setNumber);
                                return (
                                    <td key={setNumber} className="py-2 pl-3 text-right tabular-nums whitespace-nowrap text-[var(--text-secondary)]">
                                        {/* A set the session never recorded is a gap, not a zero. */}
                                        {set ? formatProgressionCell(set, rowUnit) : <span className="text-[var(--text-tertiary)]">–</span>}
                                    </td>
                                );
                            })}
                        </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
