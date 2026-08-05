/**
 * Only `reps` exercises have a weight distinct from the value performed. For `time` the performed
 * value is seconds and for `max` it is the reps achieved — both have always been stored in the
 * weight column, with getAddon() relabelling the unit. Rendering a separate reps input for those
 * types would show an empty duplicate column and the same unit twice.
 */
export const hasSeparateWeight = (repsType?: string): boolean => repsType === "reps";

/**
 * Shared column template for the set rows and their header, so the two always align.
 * 24px badge + 46px target + one or two input columns; fits a 320px viewport either way.
 */
export const getSetGrid = (repsType?: string): string => {
    return hasSeparateWeight(repsType) ? "grid grid-cols-[24px_46px_1fr_1fr] gap-2" : "grid grid-cols-[24px_46px_1fr] gap-2";
};

/**
 * Only editable values get the boxed treatment — border, elevated fill, shadow. Read-only values
 * (set number, target) stay flat text. That containment cue is what tells the user at a glance
 * which numbers they own; in history mode nothing is editable, so every box disappears.
 *
 * 16px text is load-bearing rather than cosmetic: below it, iOS Safari zooms the viewport on
 * focus, which is unusable one-handed mid-set.
 */
export const getSetInputClassName = (isHistory?: boolean): string => {
    /* A `suffix` makes antd wrap the field in an affix container, so these classes land on the
       wrapper while the inner <input> keeps its own background — which renders as a darker
       rectangle inside the field. The descendant rule flattens it; it does not match the reps
       input, whose classes sit on the element itself. */
    const base =
        "!h-11 !rounded-lg !text-[16px] !font-medium !tabular-nums !text-[var(--text-primary)] placeholder:!text-[var(--text-tertiary)] [&_.ant-input]:!bg-transparent [&_.ant-input]:!text-[16px] [&_.ant-input]:!font-medium [&_.ant-input]:!text-[var(--text-primary)]";

    if (isHistory) {
        return `${base} !bg-transparent !border-transparent !shadow-none !px-1`;
    }

    return `${base} !px-2 !bg-[var(--bg-elevated)] !border !border-solid !border-[var(--border-default)] !shadow-[var(--shadow-sm)] focus-within:!border-[var(--brand-primary)]`;
};
