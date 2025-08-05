import { ArrowRightOutlined, CloseOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, type RootState } from "../../../../store";
import { Button, Input, Modal, Skeleton } from "antd";
import { ExercisesList } from "../exercisesList/ExercisesList";
import { draftActions } from "../../../../store/draft/draft.actions";
import type { Day, Workout } from "../../../../store/draft/types";
import { useSelector } from "react-redux";
import { draftSelectors } from "../../../../store/draft/draft.selectors";
import { v4 as uuidv4 } from "uuid";
import { currentActions } from "../../../../store/current/current.actions";
import { closestCenter, DndContext, MouseSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "../../../../components/sortableItem/SortableItem";
import { useNavigate } from "react-router-dom";
import { currentSelectors } from "../../../../store/current/current.selectors";

interface WorkoutProps {
    isDraft?: boolean;
    workoutId?: string;
    isReadOnly?: boolean;
}

export const WorkoutComponent = (props: WorkoutProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [openExercisesId, setOpenExercisesId] = useState<string>();
    const [workout, setWorkout] = useState<Workout>();
    const [days, setDays] = useState<Day[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedDay, setSelectedDay] = useState<Day>();

    const draftWorkout = useSelector((state: RootState) => draftSelectors.getDraftWorkout(state));
    const currentWorkout = useSelector((state: RootState) => currentSelectors.getCurrentWorkout(state));
    const isLoadingWorkout = useSelector((state: RootState) => draftSelectors.isLoadingWorkout(state));
    const isLoadingCurrentWorkout = useSelector((state: RootState) => currentSelectors.isLoading(state));

    useEffect(() => {
        if (props.isDraft) {
            getDraft();
        } else {
            getCurrent();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isDraft]);

    useEffect(() => {
        const workout = props.isDraft ? draftWorkout : currentWorkout;
        if (workout) {
            setWorkout(workout);
            const newDays = [...workout.days];
            setDays(newDays.sort((a, b) => (a.order || 0) - (b.order || 0)));

            setTimeout(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                        top: scrollContainerRef.current.scrollHeight,
                        behavior: "smooth",
                    });
                }
            }, 0);
        }
    }, [draftWorkout, currentWorkout, props.isDraft]);

    const getDraft = async () => {
        await dispatch(draftActions.fetchDraftWorkout());
    };

    const getCurrent = async () => {
        await dispatch(currentActions.fetchCurrentWorkout());
    };

    useEffect(() => {
        if (!isModalOpen) {
            setSelectedDay(undefined);
        }
    }, [isModalOpen]);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 50,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 500,
                tolerance: 50,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = days.findIndex((item) => item.id.toString() === active.id);
            const newIndex = days.findIndex((item) => item.id.toString() === over?.id);

            const newItems = arrayMove(days, oldIndex, newIndex).map((item, index) => ({ ...item, order: index }));

            setDays(newItems);
            dispatch(
                draftActions.upsertDay(
                    newItems.map((item: Day) => {
                        return {
                            id: item.id,
                            name: item.name,
                            counter: item.counter,
                            is_last: item.isLast || false,
                            last_workout: item.lastWorkout,
                            order: item.order,
                            workout_id: workout!.id,
                        };
                    })
                )
            );
        }
    };

    /* only used if isReadOnly is false */
    const saveDay = () => {
        if (selectedDay) {
            dispatch(
                draftActions.upsertDay([
                    {
                        id: selectedDay.id || uuidv4(),
                        name: selectedDay?.name || "",
                        workout_id: workout!.id,
                        order: selectedDay.order,
                    },
                ])
            );

            setIsModalOpen(false);
        }
    };

    /* only used if isReadOnly is false */
    const handleDeleteDay = (dayId: string) => {
        dispatch(draftActions.deleteDay(dayId));
    };

    /* only used if isReadOnly is false */
    const publishWorkout = () => {
        dispatch(draftActions.publishDraftWorkout());
        navigate("/workouts");
    };

    const handleStartClick = async (dayId: string) => {
        const now = new Date();
        const newDay: Day | undefined = workout?.days.find((day) => day.id === dayId);

        if (newDay) {
            await dispatch(
                currentActions.updateDayStart({
                    id: newDay.id,
                    last_workout: now.getTime(),
                    workout_id: workout!.id,
                    name: newDay.name,
                    counter: newDay.counter ? newDay.counter + 1 : 1,
                    is_last: true,
                    order: newDay.order,
                })
            );
        }
    };

    if ((isLoadingWorkout || isLoadingCurrentWorkout) && !workout) {
        return <Skeleton active />;
    }

    return (
        <div className={`w-full h-full max-h-full md:w-3xl flex flex-col ${props.isReadOnly ? "justify-around" : "justify-between"} gap-2 pb-18`}>
            {openExercisesId ? (
                <ExercisesList
                    workoutId={workout!.id}
                    dayId={openExercisesId}
                    dayExercises={workout?.days.find((day: Day) => day.id === openExercisesId)?.dayExercises ?? []}
                    isReadOnly={props.isReadOnly}
                    setOpenExercisesId={setOpenExercisesId}
                    handleStartClick={handleStartClick}
                    lastWorkout={workout?.days.find((day: Day) => day.id === openExercisesId)?.lastWorkout}
                />
            ) : (
                <>
                    {!props.isReadOnly && (
                        <div className="flex justify-end w-full">
                            <CloseOutlined onClick={() => navigate("/gym/workouts")} />
                        </div>
                    )}
                    {!props.isReadOnly && <p className="text-left text-[12px] italic">This is the list of days. Long press and drag to reorder</p>}
                    {days && days.length > 0 ? (
                        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto flex flex-col gap-2 hide-scrollbar">
                            {props.isReadOnly ? (
                                <>
                                    {days.map((day, index) => {
                                        return (
                                            <div key={index} onClick={() => setOpenExercisesId(day.id)} className="p-3 border border-[#FFEAD8] shadow-md rounded-md flex items-center justify-between">
                                                <p>{day.name}</p>
                                                <div className="flex items-center gap-4">
                                                    {day.isLast && <div className="text-[10px] border border-[#00b300] px-2 py-[2px] rounded-md">{t("workouts.workout.is_last")}</div>}
                                                    <div className="text-[10px] border border-[#4682a9] px-2 py-[2px] rounded-md">{`${day.counter}`}</div>
                                                    <ArrowRightOutlined />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            ) : (
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                    <SortableContext
                                        items={days.map((item) => item.id.toString()).filter((id): id is string => id !== undefined && id !== null)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {days.map((day) => {
                                            return (
                                                <SortableItem key={day.id} id={day.id}>
                                                    <div className="p-3 border border-[#FFEAD8] shadow-md rounded-md">
                                                        <p className="text-left">{day.name}</p>

                                                        <div className="flex justify-between items-center mt-4 gap-2">
                                                            <Button block type="primary" onClick={() => handleDeleteDay(day.id)}>
                                                                Delete
                                                            </Button>
                                                            <Button
                                                                block
                                                                type="primary"
                                                                onClick={() => {
                                                                    setSelectedDay(day);
                                                                    setIsModalOpen(true);
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button block type="primary" onClick={() => setOpenExercisesId(day.id)}>
                                                                Details
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </SortableItem>
                                            );
                                        })}
                                    </SortableContext>
                                </DndContext>
                            )}
                        </div>
                    ) : (
                        <div>{t("workouts.workout.no_workout")}</div>
                    )}
                    {!props.isReadOnly && (
                        <div className="sticky bottom-0 flex flex-col gap-2">
                            <Button type="default" block onClick={() => setIsModalOpen(true)}>
                                {t("workouts.workout.add_day_btn")}
                            </Button>
                            <Button type="primary" className="bg-brand-primary" block onClick={publishWorkout}>
                                {t("workouts.workout.publish_btn")}
                            </Button>
                        </div>
                    )}
                </>
            )}

            <Modal title="Basic Modal" closable={{ "aria-label": "Custom Close Button" }} open={isModalOpen} onOk={saveDay} onCancel={() => setIsModalOpen(false)}>
                <Input
                    placeholder={t("workouts.workout.day_name_placeholder")}
                    value={selectedDay?.name || ""}
                    onChange={(input) =>
                        setSelectedDay((prevState) => {
                            return {
                                ...prevState,
                                id: prevState?.id || uuidv4(),
                                name: input.target.value,
                                dayExercises: prevState?.dayExercises || [],
                                order: prevState?.order !== undefined ? prevState.order : days.length,
                            };
                        })
                    }
                />
            </Modal>
        </div>
    );
};
