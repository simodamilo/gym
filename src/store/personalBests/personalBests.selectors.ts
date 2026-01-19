import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

const selectPersonalBestsState = (state: RootState) => state.personalBests;

const getPersonalBests = createSelector([selectPersonalBestsState], (personalBestsState) => personalBestsState.personalBests);

const getIsLoading = createSelector([selectPersonalBestsState], (personalBestsState) => personalBestsState.isLoading);

const getIsError = createSelector([selectPersonalBestsState], (personalBestsState) => personalBestsState.isError);

const personalBestsSelectors = {
    getPersonalBests,
    getIsLoading,
    getIsError,
};

export { personalBestsSelectors };
