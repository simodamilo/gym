import { useTranslation } from "react-i18next";
import { useAppDispatch, type RootState } from "../../../../store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { exercisesSelectors } from "../../../../store/exercisesCatalog/exercisesCatalog.selector";
import { exercisesCatalogActions } from "../../../../store/exercisesCatalog/exercisesCatalog.action";
import { Button, Input, Select } from "antd";
import type { DayExercise, Set } from "../../../../store/draft/types";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { draftSelectors } from "../../../../store/draft/draft.selectors";
import TextArea from "antd/es/input/TextArea";
import { v4 as uuidv4 } from "uuid";
import type { ExerciseCatalog } from "../../../../store/exercisesCatalog/types";
import { RepsTypes } from "../../../../utils/constants";
import { ExerciseSelects } from "../../../../components/exerciseSelects/ExerciseSelects";

export interface ExerciseContentProps {
    dayId: string;
    exerciseId: string;
    dayExercise: DayExercise;
    saveExercises: (dayExercise: DayExercise) => void;
    deleteExercise: (dayExerciseId: string) => void;
    isReadOnly?: boolean;
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
                reps: dayExercise.repsType === 'max' ? 'Max' : ''
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
        if (props.isReadOnly && isExerciseUpdated) {
            props.saveExercises(dayExercise);
        }
    };

    const getAddon = () => {
        switch (dayExercise.repsType) {
            case 'reps':
                return t('workouts.exercises.kg');
            case 'time':
                return t('workouts.exercises.secs');
            case 'max':
                return t('workouts.exercises.reps');
            default:
                return;
        }
    }

    return (
        <div className="flex flex-col gap-4">
            {!props.isReadOnly && (
                <ExerciseSelects
                    selectedExercise={dayExercise.exercise}
                    isReadOnly={props.isReadOnly}
                    onChange={(value) => {
                        setDayExercise({
                            ...dayExercise,
                            id: props.dayExercise.id,
                            orderNumber: props.dayExercise.orderNumber,
                            exercise: exercises.find((ex) => ex.id === value),
                        });
                    }} />
            )}
            <div className="flex flex-col gap-2 border rounded-md border-[#FFEAD8] p-3">
                {!props.isReadOnly && <Select
                    className="w-full md:w-xl text-left !text-[16px]"
                    placeholder={t("workouts.exercises.reps_type_placeholder")}
                    value={dayExercise.repsType}
                    onChange={(value) => {
                        setDayExercise({
                            ...dayExercise,
                            id: props.dayExercise.id,
                            orderNumber: props.dayExercise.orderNumber,
                            repsType: value,
                            sets: []
                        });
                    }}
                    options={RepsTypes}
                    disabled={isLoadingExercises}
                />}
                {dayExercise.repsType === 'custom' ? (
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
                        readOnly={props.isReadOnly}
                    />
                ) : (
                    [...(dayExercise.sets ?? [])]
                        .sort((a, b) => a.setNumber - b.setNumber)
                        .map((set: Set) => {
                            if (props.isReadOnly) {
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
                                            />
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <Input
                                    key={set.id}
                                    addonBefore={set.setNumber}
                                    placeholder={t("workouts.exercises.reps_placeholder")}
                                    value={set.reps}
                                    onChange={(input) => updateSet("reps", input.target.value, set.id)}
                                    disabled={isLoadingExercises}
                                    readOnly={dayExercise.repsType === 'max'}
                                />
                            );
                        })
                )
                }
                {!props.isReadOnly && dayExercise.repsType !== 'custom' && (
                    <div className="flex justify-between">
                        <Button type="primary" icon={<MinusOutlined />} shape="circle" onClick={removeSet} disabled={dayExercise.sets.length === 0 || !dayExercise.repsType || isLoadingExercises} />
                        <Button type="primary" icon={<PlusOutlined />} shape="circle" onClick={addSet} disabled={!dayExercise.repsType || isLoadingExercises} />
                    </div>
                )}
            </div>
            <Input
                readOnly={props.isReadOnly}
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
            <TextArea
                rows={4}
                value={dayExercise.notes}
                onChange={(input) => {
                    setDayExercise((prevState) => {
                        return {
                            ...prevState,
                            notes: input.target.value,
                        };
                    });
                    setIsExerciseUpdated(true);
                }}
                onBlur={saveWeights}
                placeholder={t("workouts.exercises.notes_placeholder")}
                disabled={isLoadingExercises}
            />
            {!props.isReadOnly && (
                <div className="flex gap-4">
                    <Button type="primary" icon={<DeleteOutlined />} danger shape="circle" disabled={props.isNew} onClick={() => props.deleteExercise(props.exerciseId)} />
                    <Button type="primary" block onClick={() => props.saveExercises(dayExercise)} disabled={!hasValidFields()}>
                        {t("workouts.exercises.save_btn")}
                    </Button>
                </div>
            )}
        </div>
    );
};
