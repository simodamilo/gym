import { combineReducers, type Action } from "redux";
import { exercisesReducer } from "./exercises/exercises.reducer";

const appReducer = combineReducers({
  ...exercisesReducer,
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
