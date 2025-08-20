import { combineReducers, type Action } from "redux";
import { exercisesReducer } from "./exercisesCatalog/exercisesCatalog.reducer";
import { draftReducer } from "./draft/draft.reducer";
import { currentReducer } from "./current/current.reducer";
import { progressesReducer } from "./progressHistory/progressHistory.reducer";
import { historyReducer } from "./history/history.reducer";

const appReducer = combineReducers({
    ...exercisesReducer,
    ...draftReducer,
    ...currentReducer,
    ...progressesReducer,
    ...historyReducer
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const rootReducer = (state: any, action: Action) => {
    if (action.type === "RESET_STORE") {
        state = undefined;
    }
    return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
