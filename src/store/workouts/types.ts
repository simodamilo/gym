import type { Day } from "../days/types";

export type WorkoutsState = {
    currentWorkout?: Workout;
    draftWorkout?: Workout;
    historyWorkouts: Workout[];
    isLoading: boolean;
    isError: boolean;
};

export interface Workout {
    id: number;
    name: string;
    created: number;
    description?: string;
    status: string;
    days: Day[];
}
