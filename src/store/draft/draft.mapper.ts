import type { DayExercise, DayExerciseResponse, Workout } from "./types"

const getDraftWorkoutDataMapper = (response: any): Workout => {
    return {
        id: response.id,
        name: response.name,
        status: response.status,
        description: response.description,
        created_at: response.created_at,
        days: response.days.map((day: any) => {
            return {
                id: day.id,
                name: day.name,
                created_at: day.created_at,
                day_exercises: day.day_exercises.map((day_exercise: DayExerciseResponse) => {
                    return {
                        id: day_exercise.id,
                        order_number: day_exercise.order_number,
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
            order_number: dayExercise.order_number,
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