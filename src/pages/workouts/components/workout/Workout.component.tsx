import { CloseOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
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
import { useNavigate, useParams } from "react-router-dom";
import { currentSelectors } from "../../../../store/current/current.selectors";
import { DayContent } from "../dayContent/DayContent";
import { MoveIcon } from "../moveIcon/MoveIcon";
import { historySelectors } from "../../../../store/history/history.selectors";

interface WorkoutProps {
    isDraft?: boolean;
    isReadOnly?: boolean;
}

export const WorkoutComponent = (props: WorkoutProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { workoutId } = useParams();

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [openExercisesId, setOpenExercisesId] = useState<string>();
    const [workout, setWorkout] = useState<Workout>();
    const [days, setDays] = useState<Day[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
    const [selectedDay, setSelectedDay] = useState<Day>();
    const [isDragEnable, setIsDragEnable] = useState<boolean>(false);

    const draftWorkout = useSelector((state: RootState) => draftSelectors.getDraftWorkout(state));
    const currentWorkout = useSelector((state: RootState) => currentSelectors.getCurrentWorkout(state));
    const archivedWorkouts = useSelector(historySelectors.getHistoryWorkouts);
    const isLoadingWorkout = useSelector((state: RootState) => draftSelectors.isLoadingWorkout(state));
    const isLoadingCurrentWorkout = useSelector((state: RootState) => currentSelectors.isLoading(state));

    useEffect(() => {
        dispatch(currentActions.showSwitcher(openExercisesId === undefined ? true : false));
    }, [openExercisesId, dispatch]);

    useEffect(() => {
        if (workoutId) {
            return;
        }

        if (props.isDraft) {
            getDraft();
        } else {
            getCurrent();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isDraft]);

    useEffect(() => {
        if (workoutId) {
            const currentWorkout = archivedWorkouts.find(workout => workout.id === workoutId);
            setWorkout(currentWorkout);
            const newDays = [...currentWorkout!.days];
            setDays(newDays.sort((a, b) => (a.order || 0) - (b.order || 0)));
            return;
        }

        const workout = props.isDraft ? draftWorkout : currentWorkout;
        if (workout) {
            setWorkout(workout);
            const newDays = [...workout.days];
            setDays(newDays.sort((a, b) => (a.order || 0) - (b.order || 0)));
        }
    }, [draftWorkout, currentWorkout, archivedWorkouts, workoutId, props.isDraft]);

    const getDraft = async () => {
        await dispatch(draftActions.fetchDraftWorkout());
    };

    const getCurrent = async () => {
        await dispatch(currentActions.fetchCurrentWorkout());
    };

    /* only used if isReadOnly is false */
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 50,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 50,
            },
        })
    );

    /* only used if isReadOnly is false */
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
    const saveDay = (type: "DELETE" | "UPDATE") => {
        if (type === "DELETE") {
            dispatch(draftActions.deleteDay(selectedDay!.id));
            setIsDeleteModalOpen(false);
        } else if (type === "UPDATE") {
            dispatch(
                draftActions.upsertDay([
                    {
                        id: selectedDay!.id || uuidv4(),
                        name: selectedDay!.name || "",
                        workout_id: workout!.id,
                        order: selectedDay!.order,
                        counter: 0,
                        is_last: false,
                    },
                ])
            );

            setIsEditModalOpen(false);
        }
        setSelectedDay(undefined);
    };

    /* only used if isReadOnly is false */
    const handleDayUpdate = (day: Day, type: "DELETE" | "UPDATE") => {
        setSelectedDay(day);
        if (type === "DELETE") {
            setIsDeleteModalOpen(true);
        } else if (type === "UPDATE") {
            setIsEditModalOpen(true);
        }
    };

    /* only used if isReadOnly is false */
    const publishWorkout = async () => {
        await dispatch(draftActions.publishDraftWorkout());
        navigate("/gym/workouts");
    };

    /* only used for current workout */
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
        <div className={`w-full h-full max-h-full md:w-3xl flex flex-col ${props.isReadOnly ? "justify-around" : "justify-between"} gap-2 pb-22`}>
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
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between w-full">
                                {!workoutId &&
                                    <div className="flex items-center gap-4">
                                        <Button size="large" type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => setIsEditModalOpen(true)} />
                                        {days && days.length > 0 && <Button size="large" type="primary" shape="circle" icon={<UploadOutlined />} onClick={() => setIsPublishModalOpen(true)} />}
                                        {days && days.length > 1 && (
                                            <Button
                                                size="large"
                                                type={isDragEnable ? "default" : "primary"}
                                                shape="circle"
                                                icon={<MoveIcon style={{ fontSize: "20px" }} />}
                                                onClick={() => setIsDragEnable(!isDragEnable)}
                                            />
                                        )}
                                    </div>
                                }
                                <div></div>
                                <CloseOutlined onClick={() => navigate(workoutId ? "/gym/workouts/history" : "/gym/workouts")} />
                            </div>
                            {days && days.length > 0 && <p className="text-left text-[12px] italic">{t("workouts.workout_page.description")}</p>}
                        </div>
                    )}
                    {days && days.length > 0 ? (
                        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto flex flex-col gap-2 hide-scrollbar">
                            {props.isReadOnly || !isDragEnable ? (
                                days.map((day, index) => {
                                    return <DayContent key={index} day={day} isReadOnly={props.isReadOnly || !!workoutId} setOpenExercisesId={setOpenExercisesId} handleDayUpdate={handleDayUpdate} />;
                                })
                            ) : (
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                    <SortableContext
                                        items={days.map((item) => item.id.toString()).filter((id): id is string => id !== undefined && id !== null)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {days.map((day) => {
                                            return (
                                                <SortableItem key={day.id} id={day.id}>
                                                    <DayContent day={day} setOpenExercisesId={setOpenExercisesId} isDraggable handleDayUpdate={handleDayUpdate} />
                                                </SortableItem>
                                            );
                                        })}
                                    </SortableContext>
                                </DndContext>
                            )}
                        </div>
                    ) : (
                        <div className="flex h-full items-center mx-auto">{t("workouts.workout_page.no_workout")}</div>
                    )}
                </>
            )}

            {/* Edit Day name */}
            <Modal
                title={t("workouts.workout_page.add_day_modal_title")}
                closable={{ "aria-label": "Custom Close Button" }}
                open={isEditModalOpen}
                onOk={() => saveDay("UPDATE")}
                onCancel={() => {
                    setIsEditModalOpen(false);
                    setSelectedDay(undefined);
                }}
            >
                <Input
                    placeholder={t("workouts.workout_page.day_name_placeholder")}
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

            {/* Delete Day */}
            <Modal
                closable={{ "aria-label": "Custom Close Button" }}
                open={isDeleteModalOpen}
                onOk={() => saveDay("DELETE")}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedDay(undefined);
                }}
            >
                <div>{t("workouts.workout_page.delete_day_modal_title")}</div>
            </Modal>

            {/* Publish Workout */}
            <Modal closable={{ "aria-label": "Custom Close Button" }} open={isPublishModalOpen} onOk={publishWorkout} onCancel={() => setIsPublishModalOpen(false)}>
                <div>{t("workouts.workout_page.publish_workout_modal_title")}</div>
            </Modal>
        </div>
    );
};
