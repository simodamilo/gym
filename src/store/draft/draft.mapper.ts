import type { DayExerciseResponse, Workout } from "./types"

const getDraftWorkoutDataMapper = (response: any): Workout => {
    return {
        id: response.id,
        name: response.name,
        status: response.status,
        description: response.description,
        createdAt: response.created_at,
        days: response.days.map((day: any) => {
            return {
                id: day.id,
                name: day.name,
                created_at: day.created_at,
                dayExercises: day.day_exercises.map((day_exercise: DayExerciseResponse) => {
                    return {
                        id: day_exercise.id,
                        orderNumber: day_exercise.order_number,
                        rest: day_exercise.rest,
                        notes: day_exercise.notes,
                        sets: day_exercise.day_exercise_sets.map((set) => {
                            return {
                                id: set.id,
                                setNumber: set.set_number,
                                reps: set.reps,
                                weight: set.weight,
                            }
                        }),
                        exercise: {
                            id: day_exercise.exercises_catalog.id,
                            name: day_exercise.exercises_catalog.name,
                            category: day_exercise.exercises_catalog.category
                        },
                    }
                })
            }
        })
    }
}

export const workoutMapper = {
    getDraftWorkoutDataMapper
}