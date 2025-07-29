import type { DayExercise, DayExerciseResponse, Workout } from "./types"

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
                        sets: day_exercise.day_exercise_sets.map((set) => {
                            return {
                                id: set.id,
                                setNumber: set.set_number,
                                reps: set.reps,
                                weight: set.weight,
                                notes: set.notes
                            }
                        }),
                        exercise: {
                            id: day_exercise.exercises.id,
                            name: day_exercise.exercises.name,
                            category_id: day_exercise.exercises.category_id
                        },
                    }
                })
            }
        })
    }
}

const getDayExerciseDataMapper = (response: DayExerciseResponse[]): DayExercise[] => {
    return response.map((dayExercise: DayExerciseResponse) => {
        return {
            id: dayExercise.id,
            orderNumber: dayExercise.order_number,
            sets: dayExercise.day_exercise_sets.map((set) => {
                return {
                    id: set.id,
                    setNumber: set.set_number,
                    reps: set.reps,
                    weight: set.weight,
                    notes: set.notes
                }
            }),
            exercise: {
                id: dayExercise.exercises.id,
                name: dayExercise.exercises.name,
                category_id: dayExercise.exercises.category_id
            },
        }
    })
}

export const workoutMapper = {
    getDraftWorkoutDataMapper,
    getDayExerciseDataMapper
}