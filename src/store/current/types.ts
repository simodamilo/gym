import type { Workout } from "../draft/types";

export type CurrentState = {
    workout?: Workout;
    showSwitcher?: boolean;
    isLoading: boolean;
    isError: boolean;
    currentRequestId?: string;
};
