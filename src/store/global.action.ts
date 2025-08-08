import { type Action } from "redux";

const RESET_STORE = "RESET_STORE";
const resetStore = (): Action => ({ type: RESET_STORE });

export const globalActions = {
    resetStore,
};
