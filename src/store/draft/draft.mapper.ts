import type { Workout } from "./types"

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
                day_exercises: day.day_exercises.map((day_exercise: any) => {
                    return {
                        id: day_exercise.id,
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

export const workoutMapper = {
    getDraftWorkoutDataMapper
}