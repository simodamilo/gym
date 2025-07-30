import type { Workout } from "../draft/types";

export type CurrentState = {
    workout?: Workout;
    isLoading: boolean;
    isError: boolean;
    currentRequestId?: string;
};
