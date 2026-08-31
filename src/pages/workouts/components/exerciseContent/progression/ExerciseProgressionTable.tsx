import { useTranslation } from "react-i18next";
import { formatSessionDate, type ProgressionSession } from "./progression.utils";
import { getValueUnitKey } from "../../../../../utils/reps";

interface ExerciseProgressionTableProps {
    sessions: ProgressionSession[];
}

/**
 * Always available, and the only view for reps types that cannot be charted. Newest first,
 * which is the opposite of the chart: here the user is reading, not following a trend.
 */
export const ExerciseProgressionTable = ({ sessions }: ExerciseProgressionTableProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-2">
            {[...sessions].reverse().map((session) => (
                <div key={session.sessionId} className="rounded-lg border border-solid border-[var(--border-default)] px-3 py-2">
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="text-sm font-semibold text-[var(--text-primary)]">{formatSessionDate(session.startedAt)}</span>
                        <span className="text-xs text-[var(--text-tertiary)]">#{session.ordinal}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {session.sets.map((set) => (
                            <span key={`${set.sessionId}-${set.setNumber}`} className="text-sm text-[var(--text-secondary)]">
                                {/* The unit varies: only `reps` exercises store a weight here — time stores
                                    seconds and max stores the reps achieved. */}
                                <span className="text-[var(--text-tertiary)]">{set.setNumber}.</span> {set.weight ?? "-"} {t(getValueUnitKey(set.repsType))}
                                {set.repsRaw ? ` × ${set.repsRaw}` : ""}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
