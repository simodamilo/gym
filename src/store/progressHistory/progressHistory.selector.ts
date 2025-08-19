import type { RootState } from "../reducer.config";
import type { ProgressHistory } from "./types";

const getProgresses = (state: RootState): ProgressHistory[] => {
    return state.progresses.progresses;
};

export const progressesSelectors = {
    getProgresses,
};
