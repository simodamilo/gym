import { ArrowLeftOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input, Skeleton } from "antd";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { closestCenter, DndContext, MouseSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../utils/routing/routes";
import { useAppDispatch, type RootState } from "../../../store";
import type { Day, Workout } from "../../../store/draft/types";
import { draftSelectors } from "../../../store/draft/draft.selectors";
import { draftActions } from "../../../store/draft/draft.actions";
import { IconButton } from "../../../components/iconButton/IconButton";
import { MoveIcon } from "../../../components/moveIcon/MoveIcon";
import { SortableItem } from "../../../components/sortableItem/SortableItem";
import { CustomModal } from "../../../components/customModal";
import { ItemCard } from "../components/itemCard/ItemCard";
import { currentActions } from "../../../store/current/current.actions";
import { EmptyState } from "../../../components/emptyState/EmptyState";
import { PageSEO } from "../../../components/seo/PageSEO";

export const CreateWorkout = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [workout, setWorkout] = useState<Workout>();
    const [days, setDays] = useState<Day[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
    const [selectedDay, setSelectedDay] = useState<Day>();
    const [isDragEnable, setIsDragEnable] = useState<boolean>(false);

    const draftWorkout = useSelector((state: RootState) => draftSelectors.getDraftWorkout(state));
    const isLoadingWorkout = useSelector((state: RootState) => draftSelectors.isLoadingWorkout(state));

    useEffect(() => {
        getDraft();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const workout = draftWorkout;
        if (workout) {
            setWorkout(workout);
            const newDays = [...workout.days];
            setDays(newDays.sort((a, b) => (a.order || 0) - (b.order || 0)));
        }
    }, [draftWorkout]);

    const getDraft = async () => {
        await dispatch(draftActions.fetchDraftWorkout());
    };

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
        }),
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
                    }),
                ),
            );
        }
    };

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
                ]),
            );

            setIsEditModalOpen(false);
        }
        setSelectedDay(undefined);
    };

    const handleDayUpdate = (day: Day, type: "DELETE" | "UPDATE") => {
        setSelectedDay(day);
        if (type === "DELETE") {
            setIsDeleteModalOpen(true);
        } else if (type === "UPDATE") {
            setIsEditModalOpen(true);
        }
    };

    const publishWorkout = async () => {
        await dispatch(draftActions.publishDraftWorkout());
        navigate(routes.workoutsCurrent);
        dispatch(currentActions.showSwitcher(true));
    };

    if (isLoadingWorkout && !workout) {
        return (
            <>
                <PageSEO titleKey="seo.titles.workouts_create" descriptionKey="seo.descriptions.workouts_create" />
                <Skeleton active />
            </>
        );
    }

    return (
        <>
            <PageSEO titleKey="seo.titles.workouts_create" descriptionKey="seo.descriptions.workouts_create" />
            <div className={`w-full h-full max-h-full md:max-w-4xl lg:max-w-5xl xl:max-w-6xl flex flex-col gap-2 justify-between py-4`}>
            <div className="flex flex-col gap-4">
                <div className="flex w-full items-center gap-4 justify-between">
                    <button
                        onClick={() => {
                            navigate(routes.workoutsCurrent);
                            dispatch(currentActions.showSwitcher(true));
                        }}
                        className="bg-transparent border-0 p-0 cursor-pointer text-2xl leading-none transition-all duration-150 flex items-center justify-center hover:-translate-x-0.5 active:scale-95 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                        aria-label="Go back"
                    >
                        <ArrowLeftOutlined />
                    </button>
                    <div className="flex gap-2">
                        {days && days.length > 0 && <IconButton icon={<UploadOutlined />} onClick={() => setIsPublishModalOpen(true)} />}
                        <IconButton icon={<PlusOutlined />} onClick={() => setIsEditModalOpen(true)} />
                        {days && days.length > 1 && <IconButton icon={<MoveIcon className="text-xl" />} onClick={() => setIsDragEnable(!isDragEnable)} />}
                    </div>
                </div>
                {days && days.length > 0 && <p className="text-left text-[12px] italic">{t("workouts.workout_page.description")}</p>}
            </div>
            {days && days.length > 0 ? (
                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto flex flex-col gap-2 hide-scrollbar pb-28 rounded-b-xl md:px-2">
                    {!isDragEnable ? (
                        days.map((day, index) => {
                            return (
                                <ItemCard
                                    key={index}
                                    title={day.name || ""}
                                    exerciseCount={day.dayExercises.length}
                                    onClick={() => navigate(`${day?.id}/exercises`)}
                                    isCreation
                                    day={day}
                                    handleDayUpdate={handleDayUpdate}
                                />
                            );
                        })
                    ) : (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={days.map((item) => item.id.toString()).filter((id): id is string => id !== undefined && id !== null)} strategy={verticalListSortingStrategy}>
                                {days.map((day) => {
                                    return (
                                        <SortableItem key={day.id} id={day.id}>
                                            <ItemCard title={day.name || ""} exerciseCount={day.dayExercises.length} isCreation day={day} handleDayUpdate={handleDayUpdate} isDraggable />
                                        </SortableItem>
                                    );
                                })}
                            </SortableContext>
                        </DndContext>
                    )}
                </div>
            ) : (
                <EmptyState icon={<PlusOutlined />} title={t("workouts.workout_page.no_workout")} description={t('pages.create.empty_day_hint')} animated={false} className="pb-28" />
            )}

            {/* Edit Day name */}
            <CustomModal
                type="edit"
                title={t("workouts.workout_page.add_day_modal_title")}
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
                    className="bg-[var(--bg-tertiary)] border-[var(--border-light)] text-[var(--text-primary)]"
                />
            </CustomModal>

            {/* Delete Day */}
            <CustomModal
                type="delete"
                title={t("workouts.workout_page.delete_day_modal_title")}
                open={isDeleteModalOpen}
                onOk={() => saveDay("DELETE")}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedDay(undefined);
                }}
            >
                <p className="text-[var(--text-secondary)] m-0">{t('pages.create.delete_day_warning')}</p>
            </CustomModal>

            {/* Publish Workout */}
            <CustomModal type="publish" title={t("workouts.workout_page.publish_workout_modal_title")} open={isPublishModalOpen} onOk={publishWorkout} onCancel={() => setIsPublishModalOpen(false)}>
                <p className="text-[var(--text-secondary)] m-0">{t('pages.create.publish_confirmation')}</p>
            </CustomModal>
            </div>
        </>
    );
};
