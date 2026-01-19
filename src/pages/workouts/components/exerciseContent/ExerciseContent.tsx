import { useTranslation } from "react-i18next";
import { useAppDispatch, type RootState } from "../../../../store";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { exercisesSelectors } from "../../../../store/exercisesCatalog/exercisesCatalog.selector";
import { exercisesCatalogActions } from "../../../../store/exercisesCatalog/exercisesCatalog.action";
import { Checkbox, Input, Select, Tooltip } from "antd";
import type { DayExercise, Set } from "../../../../store/draft/types";
import { DeleteOutlined, InfoCircleOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { draftSelectors } from "../../../../store/draft/draft.selectors";
import TextArea from "antd/es/input/TextArea";
import { v4 as uuidv4 } from "uuid";
import type { ExerciseCatalog } from "../../../../store/exercisesCatalog/types";
import { RepsTypes } from "../../../../utils/constants";
import { ExerciseSelects } from "../../../../components/exerciseSelects/ExerciseSelects";
import { Button } from "../../../../components/button/Button";

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
        const newSets: Set[] = [...dayExercise.sets].map((set) => {
            if (set.id === setId) {
                return {
                    ...set,
                    [fieldToUpdate]: newValue,
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
        <div className="flex flex-col gap-5">
            {/* Superset Checkbox - Minimal style */}
            {props.isDraft && (
                <Checkbox
                    checked={dayExercise.isLinkedToNext}
                    onChange={() => setDayExercise({ ...dayExercise, isLinkedToNext: !dayExercise.isLinkedToNext })}
                    className="text-text-primary"
                >
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {t("workouts.exercises.superset")}
                    </span>
                </Checkbox>
            )}

            {/* Exercise Selects */}
            {props.isDraft && (
                <ExerciseSelects
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

            {/* Reps Type Selector - Modern minimal design */}
            {props.isDraft && (
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <Select
                            className="text-left !text-[14px] w-full"
                            placeholder={t("workouts.exercises.reps_type_placeholder")}
                            value={dayExercise.repsType}
                            onChange={(value) => {
                                // Auto-create first set when reps type is selected (except for custom)
                                const initialSets = value !== "custom" ? [{
                                    id: uuidv4(),
                                    setNumber: 1,
                                    reps: value === "max" ? "Max" : "",
                                }] : [];

                                setDayExercise({
                                    ...dayExercise,
                                    id: props.dayExercise.id,
                                    orderNumber: props.dayExercise.orderNumber,
                                    repsType: value,
                                    sets: initialSets,
                                });
                            }}
                            options={RepsTypes}
                            disabled={isLoadingExercises}
                            style={{
                                borderRadius: '8px',
                            }}
                        />
                    </div>
                    {dayExercise.repsType !== "custom" && (
                        <div className="flex gap-2">
                            <button
                                onClick={removeSet}
                                disabled={dayExercise.sets.length === 0 || !dayExercise.repsType || isLoadingExercises}
                                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                                style={{
                                    backgroundColor: 'var(--bg-elevated)',
                                    border: '1px solid var(--border-light)',
                                    color: 'var(--text-primary)',
                                }}
                                onMouseEnter={(e) => {
                                    if (!e.currentTarget.disabled) {
                                        e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!e.currentTarget.disabled) {
                                        e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                                    }
                                }}
                            >
                                <MinusOutlined style={{ fontSize: '12px' }} />
                            </button>
                            <button
                                onClick={addSet}
                                disabled={!dayExercise.repsType || isLoadingExercises}
                                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                                style={{
                                    backgroundColor: 'var(--bg-elevated)',
                                    border: '1px solid var(--border-light)',
                                    color: 'var(--text-primary)',
                                }}
                                onMouseEnter={(e) => {
                                    if (!e.currentTarget.disabled) {
                                        e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!e.currentTarget.disabled) {
                                        e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                                    }
                                }}
                            >
                                <PlusOutlined style={{ fontSize: '12px' }} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Sets Container - Clean, minimal card */}
            {(dayExercise.repsType || !props.isDraft) && (
                <div
                    className="flex flex-col gap-3 rounded-xl p-4"
                    style={{
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border-light)',
                    }}
                >
                    {dayExercise.repsType === "custom" ? (
                        <TextArea
                            rows={4}
                            value={dayExercise.customType}
                            onChange={(input) => {
                                setDayExercise((prevState) => {
                                    return {
                                        ...prevState,
                                        customType: input.target.value,
                                    };
                                });
                                setIsExerciseUpdated(true);
                            }}
                            placeholder={t("workouts.exercises.notes_placeholder")}
                            disabled={isLoadingExercises}
                            readOnly={props.isCurrent || props.isHistory}
                            style={{
                                borderRadius: '8px',
                                fontSize: '14px',
                            }}
                        />
                    ) : (
                        [...(dayExercise.sets ?? [])]
                            .sort((a, b) => a.setNumber - b.setNumber)
                            .map((set: Set) => {
                                if (props.isCurrent || props.isHistory) {
                                    return (
                                        <div key={set.id} className="flex gap-3 w-full">
                                            <div className="w-[40%]">
                                                <Input
                                                    readOnly
                                                    addonBefore={set.setNumber}
                                                    value={set.reps}
                                                    style={{ borderRadius: '8px', fontSize: '14px' }}
                                                />
                                            </div>
                                            <div className="w-[60%]">
                                                <Input
                                                    type="text"
                                                    inputMode="decimal"
                                                    key={set.id}
                                                    addonBefore={getAddon()}
                                                    value={set.weight}
                                                    onChange={(input) => {
                                                        const normalizedValue = input.target.value.replace(',', '.');
                                                        updateSet("weight", normalizedValue, set.id);
                                                    }}
                                                    disabled={isLoadingExercises}
                                                    readOnly={props.isHistory}
                                                    style={{ borderRadius: '8px', fontSize: '14px' }}
                                                />
                                            </div>
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
                                        style={{ borderRadius: '8px', fontSize: '14px' }}
                                    />
                                );
                            })
                    )}
                </div>
            )}

            {/* Initial & Rest Section - Tab-like minimal design */}
            <div className="flex gap-3">
                <Tooltip
                    title={
                        <div>
                            {[...(dayExercise.sets ?? [])]
                                .sort((a, b) => a.setNumber - b.setNumber)
                                .map((set: Set) => {
                                    return (
                                        <div key={set.id}>
                                            {set.setNumber} - {set.baseWeight}
                                        </div>
                                    );
                                })}
                        </div>
                    }
                >
                    <button
                        className="px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                        style={{
                            backgroundColor: 'var(--bg-elevated)',
                            border: '1px solid var(--border-light)',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        {t("workouts.exercises.initial")}
                    </button>
                </Tooltip>
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
                    style={{ borderRadius: '8px', fontSize: '14px' }}
                />
                {(props.isCurrent || props.isHistory) && dayExercise.creationNotes && (
                    <Tooltip title={dayExercise.creationNotes}>
                        <button
                            className="w-10 h-10 flex items-center justify-center rounded-lg"
                            style={{
                                backgroundColor: 'var(--bg-elevated)',
                                border: '1px solid var(--border-light)',
                            }}
                        >
                            <InfoCircleOutlined
                                className="text-[18px]"
                                style={{ color: 'var(--text-tertiary)' }}
                            />
                        </button>
                    </Tooltip>
                )}
            </div>

            {/* Notes Section - Subtle textarea */}
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
                    style={{
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border-light)',
                    }}
                />
            )}

            {/* Action Buttons - Modern minimal design */}
            {props.isDraft && (
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => props.deleteExercise?.(props.exerciseId)}
                        disabled={props.isNew}
                        className="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border-light)',
                            color: 'var(--text-tertiary)',
                        }}
                        onMouseEnter={(e) => {
                            if (!e.currentTarget.disabled) {
                                e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                                e.currentTarget.style.color = 'var(--error)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!e.currentTarget.disabled) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = 'var(--text-tertiary)';
                            }
                        }}
                    >
                        <DeleteOutlined style={{ fontSize: '16px' }} />
                    </button>
                    <Button
                        label={t("workouts.exercises.save_btn")}
                        onClick={() => props.saveExercises?.(dayExercise)}
                        disabled={!hasValidFields()}
                    />
                </div>
            )}
        </div>
    );
};
