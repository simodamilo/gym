import { createReducer } from "@reduxjs/toolkit";
import { personalBestsActions } from "./personalBests.actions";
import type { PersonalBestsState } from "./types";

const initialState: PersonalBestsState = {
    personalBests: [],
    isLoading: false,
    isError: false,
};

export const personalBestsReducer = {
    personalBests: createReducer(initialState, (builder) => {
        builder
            .addCase(personalBestsActions.fetchPersonalBests.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(personalBestsActions.fetchPersonalBests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.personalBests = action.payload;
                state.isError = false;
            })
            .addCase(personalBestsActions.fetchPersonalBests.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            });
    }),
};
