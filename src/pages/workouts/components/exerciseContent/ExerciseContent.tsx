import { useTranslation } from "react-i18next";
import { useAppDispatch, type RootState } from "../../../../store";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { exercisesSelectors } from "../../../../store/exercisesCatalog/exercisesCatalog.selector";
import { exercisesCatalogActions } from "../../../../store/exercisesCatalog/exercisesCatalog.action";
import { Checkbox, Divider, Input, Modal, Select, Tooltip } from "antd";
import type { DayExercise, Set } from "../../../../store/draft/types";
import { DeleteOutlined, InfoCircleOutlined, LineChartOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { draftSelectors } from "../../../../store/draft/draft.selectors";
import TextArea from "antd/es/input/TextArea";
import { v4 as uuidv4 } from "uuid";
import type { ExerciseCatalog } from "../../../../store/exercisesCatalog/types";
import { RepsTypes } from "../../../../utils/constants";
import { ExerciseSelectsModal } from "../../../../components/exerciseSelects/ExerciseSelectsModal";
import { Button } from "../../../../components/button/Button";
import { IconButton } from "../../../../components/iconButton/IconButton";
import { ExerciseProgression } from "./progression/ExerciseProgression";
import { SetRowHeader } from "./SetRowHeader";
import { getSetGrid, getSetInputClassName, hasSeparateWeight } from "./setRow.styles";

export interface ExerciseContentProps {
    dayId: string;
    exerciseId: string;
    dayExercise: DayExercise;
    saveExercises?: (dayExercise: DayExercise) => void;
    deleteExercise?: (dayExerciseId: string) => void;
    isDraft?: boolean;
    isCurrent?: boolean;
    isHistory?: boolean;
    isNew?: boolean;
}

export const ExerciseContent = (props: ExerciseContentProps) => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [dayExercise, setDayExercise] = useState<DayExercise>(props.dayExercise);
    const [isExerciseUpdated, setIsExerciseUpdated] = useState<boolean>(false);
    const [showProgression, setShowProgression] = useState<boolean>(false);

    const exercises: ExerciseCatalog[] = useSelector((state: RootState) => exercisesSelectors.getExercises(state));
    const isLoadingExercises: boolean = useSelector((state: RootState) => draftSelectors.isLoadingExercises(state));

    useEffect(() => {
        if (!props.isCurrent || !isExerciseUpdated) return;

        // Clear previous timer if user types again
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Start a new 5s timer
        saveTimeoutRef.current = setTimeout(() => {
            saveWeights();
        }, 5000);

        // Cleanup on unmount or when dependency changes
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dayExercise, isExerciseUpdated, props.isCurrent]);

    useEffect(() => {
        if (props.dayExercise) {
            setDayExercise(props.dayExercise);
            setIsExerciseUpdated(false);
        }
    }, [props.dayExercise]);

    useEffect(() => {
        getExercises();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getExercises = async () => {
        await dispatch(exercisesCatalogActions.fetchExercisesCatalog());
    };

    const hasValidFields = (): boolean => {
        return !!dayExercise.exercise;
    };

    const addSet = () => {
        if (dayExercise.sets) {
            const newSets: Set[] = [...dayExercise.sets];
            const newSetNumber: number = Math.max(...newSets.map((set) => set.setNumber), 0) + 1;
            newSets.push({
                id: uuidv4(),
                setNumber: newSetNumber,
                reps: dayExercise.repsType === "max" ? "Max" : "",
            });
            setDayExercise((prevState) => {
                return {
                    ...prevState,
                    sets: newSets,
                };
            });
        }
    };

    const removeSet = () => {
        const newSets: Set[] = [...dayExercise.sets];
        setDayExercise((prevState) => {
            return {
                ...prevState,
                sets: newSets.filter((set) => set.setNumber !== newSets.length),
            };
        });
    };

    const updateSet = (fieldToUpdate: string, newValue: string, setId: string) => {
        // Convert comma to period for weight field (DB compatibility)
        let valueToStore = newValue;
        if (fieldToUpdate === "weight" && newValue) {
            valueToStore = newValue.replace(/,/g, ".");
        }

        const newSets: Set[] = [...dayExercise.sets].map((set) => {
            if (set.id === setId) {
                return {
                    ...set,
                    [fieldToUpdate]: valueToStore,
                };
            }
            return set;
        });

        setDayExercise((prevState) => {
            return {
                ...prevState,
                sets: newSets,
            };
        });

        setIsExerciseUpdated(true);
    };

    const saveWeights = () => {
        if (props.isCurrent && isExerciseUpdated) {
            props.saveExercises?.(dayExercise);
            setIsExerciseUpdated(false);
        }
    };

    const getAddon = () => {
        switch (dayExercise.repsType) {
            case "reps":
                return t("workouts.exercises.kg");
            case "time":
                return t("workouts.exercises.secs");
            case "max":
                return t("workouts.exercises.reps");
            default:
                return;
        }
    };

    return (
        <div className="flex flex-col gap-4 md:max-w-[400px] md:m-auto">
            {/* Checkbox for superset - only draft mode */}
            {props.isDraft && (
                <Checkbox checked={dayExercise.isLinkedToNext} onChange={() => setDayExercise({ ...dayExercise, isLinkedToNext: !dayExercise.isLinkedToNext })}>
                    {t("workouts.exercises.superset")}
                </Checkbox>
            )}

            {/* Exercise selection - only draft mode */}
            {props.isDraft && (
                <ExerciseSelectsModal
                    selectedExercise={dayExercise.exercise}
                    onChange={(value) => {
                        setDayExercise({
                            ...dayExercise,
                            id: props.dayExercise.id,
                            orderNumber: props.dayExercise.orderNumber,
                            exercise: exercises.find((ex) => ex.id === value),
                        });
                    }}
                />
            )}

            {props.isDraft && <Divider />}

            {/* Sets and Reps */}
            <div className="flex flex-col gap-2">
                {props.isDraft && (
                    <div className="flex justify-between gap-2 items-center">
                        <div className="w-full">
                            <Select
                                className="text-left !text-[16px] w-full"
                                placeholder={t("workouts.exercises.reps_type_placeholder")}
                                value={dayExercise.repsType}
                                onChange={(value) => {
                                    setDayExercise({
                                        ...dayExercise,
                                        id: props.dayExercise.id,
                                        orderNumber: props.dayExercise.orderNumber,
                                        repsType: value,
                                        sets: [],
                                    });
                                }}
                                options={RepsTypes}
                                disabled={isLoadingExercises}
                            />
                        </div>
                        {props.isDraft && (
                            <div className="flex justify-end gap-2 ">
                                <IconButton icon={<MinusOutlined />} onClick={removeSet} disabled={dayExercise.sets.length === 0 || !dayExercise.repsType || isLoadingExercises} />
                                <IconButton icon={<PlusOutlined />} onClick={addSet} disabled={!dayExercise.repsType || isLoadingExercises} />
                            </div>
                        )}
                    </div>
                )}
                {/* `custom` can no longer be chosen, but exercises created before it was withdrawn still
                    carry it. Their free text stays readable so no logged workout loses its content. */}
                {dayExercise.repsType === "custom" ? (
                    <TextArea rows={4} value={dayExercise.customType} readOnly disabled={isLoadingExercises} />
                ) : (
                    <div className="flex flex-col gap-2" role="group" aria-label={dayExercise.exercise?.name}>
                        {(props.isCurrent || props.isHistory) && (dayExercise.sets ?? []).length > 0 && (
                            <SetRowHeader repsType={dayExercise.repsType} unitLabel={getAddon()} />
                        )}
                        {[...(dayExercise.sets ?? [])]
                        .sort((a, b) => a.setNumber - b.setNumber)
                        .map((set: Set) => {
                            if (props.isCurrent || props.isHistory) {
                                return (
                                    <div key={set.id} className={`${getSetGrid(dayExercise.repsType)} items-center min-h-[44px]`}>
                                        {/* Set number: flat badge, deliberately never boxed like an input */}
                                        <span
                                            aria-hidden="true"
                                            className="flex items-center justify-center h-6 w-6 rounded-full bg-[var(--bg-tertiary)] text-[12px] font-semibold text-[var(--text-secondary)] tabular-nums"
                                        >
                                            {set.setNumber}
                                        </span>

                                        {/* Target: read-only, so borderless and quiet. Never --text-tertiary,
                                            which fails contrast in light mode. */}
                                        <span id={`target-${set.id}`} className="text-center text-[13px] leading-tight tabular-nums text-[var(--text-secondary)] truncate">
                                            {set.targetReps || "–"}
                                        </span>

                                        {/* Only `reps` exercises log reps separately; for time and max the
                                            single value column below is the performed value. */}
                                        {hasSeparateWeight(dayExercise.repsType) && (
                                            <Input
                                                inputMode="numeric"
                                                value={set.reps}
                                                onChange={(input) => updateSet("reps", input.target.value, set.id)}
                                                disabled={isLoadingExercises}
                                                readOnly={props.isHistory}
                                                aria-label={t("workouts.exercises.aria_performed", { set: set.setNumber })}
                                                aria-describedby={set.targetReps ? `target-${set.id}` : undefined}
                                                className={getSetInputClassName(props.isHistory)}
                                            />
                                        )}

                                        <Input
                                            inputMode="decimal"
                                            value={set.weight}
                                            placeholder="–"
                                            onChange={(input) => updateSet("weight", input.target.value, set.id)}
                                            disabled={isLoadingExercises}
                                            readOnly={props.isHistory}
                                            aria-label={t("workouts.exercises.aria_weight", { set: set.setNumber, unit: getAddon() })}
                                            aria-describedby={!hasSeparateWeight(dayExercise.repsType) && set.targetReps ? `target-${set.id}` : undefined}
                                            suffix={<span className="text-[12px] text-[var(--text-secondary)] select-none pointer-events-none">{getAddon()}</span>}
                                            className={getSetInputClassName(props.isHistory)}
                                        />
                                    </div>
                                );
                            }
                            return (
                                <Input
                                    key={set.id}
                                    addonBefore={set.setNumber}
                                    placeholder={t(`workouts.exercises.reps_placeholder_${dayExercise.repsType}`)}
                                    value={set.reps}
                                    onChange={(input) => updateSet("reps", input.target.value, set.id)}
                                    disabled={isLoadingExercises}
                                    readOnly={dayExercise.repsType === "max"}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
            <Divider />

            {/* Initial Weight and Rest */}
            <div className="flex gap-4">
                {!props.isDraft && (
                    <button
                        type="button"
                        onClick={() => setShowProgression(true)}
                        className="flex items-center gap-1 border border-solid border-[var(--border-default)] rounded-md px-2 bg-transparent cursor-pointer text-[var(--text-primary)]"
                    >
                        <LineChartOutlined />
                        <p className="m-0">{t("workouts.exercises.progression")}</p>
                    </button>
                )}
                <Input
                    readOnly={props.isCurrent || props.isHistory}
                    addonBefore={t("workouts.exercises.rest_label")}
                    placeholder={t("workouts.exercises.rest_placeholder")}
                    value={dayExercise.rest}
                    onChange={(input) => {
                        setDayExercise((prevState) => {
                            return {
                                ...prevState,
                                rest: input.target.value,
                            };
                        });
                    }}
                    disabled={isLoadingExercises}
                />
                {(props.isCurrent || props.isHistory) && dayExercise.creationNotes && (
                    <Tooltip title={dayExercise.creationNotes}>
                        <InfoCircleOutlined className="text-[20px]" />
                    </Tooltip>
                )}
            </div>

            {/* Notes */}
            {!props.isHistory && (
                <TextArea
                    rows={4}
                    value={props.isDraft ? dayExercise.creationNotes : dayExercise.notes}
                    onChange={(input) => {
                        setDayExercise((prevState) => {
                            return {
                                ...prevState,
                                [props.isDraft ? "creationNotes" : "notes"]: input.target.value,
                            };
                        });
                        setIsExerciseUpdated(true);
                    }}
                    onBlur={saveWeights}
                    placeholder={t("workouts.exercises.notes_placeholder")}
                    disabled={isLoadingExercises}
                />
            )}
            {props.isDraft && (
                <div className="flex items-center gap-4">
                    <IconButton icon={<DeleteOutlined />} disabled={props.isNew} onClick={() => props.deleteExercise?.(props.exerciseId)} />
                    <Button label={t("workouts.exercises.save_btn")} onClick={() => props.saveExercises?.(dayExercise)} disabled={!hasValidFields()} />
                </div>
            )}

            <Modal open={showProgression} onCancel={() => setShowProgression(false)} footer={null} title={dayExercise.exercise?.name ?? t("workouts.exercises.progression")} destroyOnClose>
                <ExerciseProgression exerciseId={dayExercise.exercise?.id} />
            </Modal>
        </div>
    );
};
