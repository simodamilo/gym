import type { ExerciseCatalog } from "../exercisesCatalog/types";
import type { DayExerciseResponse, DayResponse, Set, Workout } from "./types";

const getDraftWorkoutDataMapper = (response: any): Workout => {
    return {
        id: response.id,
        status: response.status,
        createdAt: response.created_at,
        startDate: response.start_date,
        endDate: response.end_date,
        days: response.days.map((day: DayResponse) => {
            return {
                id: day.id,
                name: day.name,
                counter: day.counter,
                isLast: day.is_last,
                lastWorkout: day.last_workout,
                createdAt: day.created_at,
                order: day.order,
                dayExercises: day.day_exercises.map((day_exercise: DayExerciseResponse) => {
                    return {
                        id: day_exercise.id,
                        orderNumber: day_exercise.order_number,
                        rest: day_exercise.rest,
                        notes: day_exercise.notes,
                        repsType: day_exercise.reps_type,
                        customType: day_exercise.custom_type,
                        sets: day_exercise.day_exercise_sets.map((set) => {
                            return {
                                id: set.id,
                                setNumber: set.set_number,
                                reps: set.reps,
                                weight: set.weight,
                            } as Set;
                        }),
                        exercise: {
                            id: day_exercise.exercises_catalog.id,
                            name: day_exercise.exercises_catalog.name,
                            category: day_exercise.exercises_catalog.category,
                            created_at: day_exercise.exercises_catalog.created_at,
                            description: day_exercise.exercises_catalog.description,
                        } as ExerciseCatalog,
                    };
                }),
            };
        }),
    };
};

export const workoutMapper = {
    getDraftWorkoutDataMapper,
};
