import { combineReducers, type Action } from "redux";
import { exercisesReducer } from "./exercises/exercises.reducer";
import { categoriesReducer } from "./categories/categories.reducer";
import { workoutsReducer } from "./workouts/workouts.reducer";

const appReducer = combineReducers({
    ...exercisesReducer,
    ...categoriesReducer,
    ...workoutsReducer,
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
