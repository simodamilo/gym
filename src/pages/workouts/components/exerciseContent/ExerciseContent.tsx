import { useTranslation } from "react-i18next";
import { useAppDispatch, type RootState } from "../../../../store";
import { useEffect, useState } from "react";
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
import { IconButton } from "../../../../components/iconButton/IconButton";
import { Button } from "../../../../components/button/Button";

export interface ExerciseContentProps {
    dayId: string;
    exerciseId: string;
    dayExercise: DayExercise;
    saveExercises: (dayExercise: DayExercise) => void;
    deleteExercise: (dayExerciseId: string) => void;
    isDraft?: boolean;
    isCurrent?: boolean;
    isHistory?: boolean;
    isNew?: boolean;
}

export const ExerciseContent = (props: ExerciseContentProps) => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const [dayExercise, setDayExercise] = useState<DayExercise>(props.dayExercise);
    const [isExerciseUpdated, setIsExerciseUpdated] = useState<boolean>(false);

    const exercises: ExerciseCatalog[] = useSelector((state: RootState) => exercisesSelectors.getExercises(state));
    const isLoadingExercises: boolean = useSelector((state: RootState) => draftSelectors.isLoadingExercises(state));

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
            props.saveExercises(dayExercise);
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
        <div className="flex flex-col gap-4">
            {props.isDraft && (
                <Checkbox checked={dayExercise.isLinkedToNext} onChange={() => setDayExercise({ ...dayExercise, isLinkedToNext: !dayExercise.isLinkedToNext })}>
                    {t("workouts.exercises.superset")}
                </Checkbox>
            )}
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
            <div className="flex flex-col gap-2 border rounded-md border-none bg-[#ededed] p-3">
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
                        {props.isDraft && dayExercise.repsType !== "custom" && (
                            <div className="flex justify-end gap-2 ">
                                <IconButton size="SMALL" icon={<MinusOutlined />} onClick={removeSet} disabled={dayExercise.sets.length === 0 || !dayExercise.repsType || isLoadingExercises} />
                                <IconButton size="SMALL" icon={<PlusOutlined />} onClick={addSet} disabled={!dayExercise.repsType || isLoadingExercises} />
                            </div>
                        )}
                    </div>
                )}
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
                        onBlur={saveWeights}
                        placeholder={t("workouts.exercises.notes_placeholder")}
                        disabled={isLoadingExercises}
                        readOnly={props.isCurrent || props.isHistory}
                    />
                ) : (
                    [...(dayExercise.sets ?? [])]
                        .sort((a, b) => a.setNumber - b.setNumber)
                        .map((set: Set) => {
                            if (props.isCurrent || props.isHistory) {
                                return (
                                    <div key={set.id} className="flex gap-4 w-full">
                                        <div className="w-[40%]">
                                            <Input readOnly addonBefore={set.setNumber} value={set.reps} />
                                        </div>
                                        <div className="w-[60%]">
                                            <Input
                                                key={set.id}
                                                addonBefore={getAddon()}
                                                value={set.weight}
                                                onChange={(input) => updateSet("weight", input.target.value, set.id)}
                                                onBlur={saveWeights}
                                                disabled={isLoadingExercises}
                                                readOnly={props.isHistory}
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
                                />
                            );
                        })
                )}
            </div>
            <div className="flex gap-4">
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
                    <IconButton size="SMALL" icon={<DeleteOutlined />} disabled={props.isNew} onClick={() => props.deleteExercise(props.exerciseId)} />
                    <Button label={t("workouts.exercises.save_btn")} onClick={() => props.saveExercises(dayExercise)} disabled={!hasValidFields()} />
                </div>
            )}
        </div>
    );
};
