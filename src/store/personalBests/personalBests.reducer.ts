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
            // Fetch all personal bests (workout-derived)
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
            })
            // Fetch manual personal bests
            .addCase(personalBestsActions.fetchManualPersonalBests.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(personalBestsActions.fetchManualPersonalBests.fulfilled, (state, action) => {
                state.isLoading = false;
                // Merge manual PRs with existing workout-derived PRs
                const manualPRs = action.payload;
                const workoutPRs = state.personalBests.filter((pb) => !pb.isManual);

                // Create a map to merge by exercise ID
                const mergedMap = new Map<string, typeof state.personalBests[0]>();

                // Add workout PRs
                workoutPRs.forEach((pr) => {
                    mergedMap.set(pr.exerciseId, pr);
                });

                // Add or override with manual PRs if they have higher weight
                manualPRs.forEach((pr) => {
                    const existing = mergedMap.get(pr.exerciseId);
                    if (!existing || pr.maxWeight > existing.maxWeight) {
                        mergedMap.set(pr.exerciseId, pr);
                    }
                });

                // Convert back to array and sort by weight
                state.personalBests = Array.from(mergedMap.values()).sort(
                    (a, b) => b.maxWeight - a.maxWeight
                );
                state.isError = false;
            })
            .addCase(personalBestsActions.fetchManualPersonalBests.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            // Add manual personal best
            .addCase(personalBestsActions.addManualPersonalBest.fulfilled, (state, action) => {
                const newPR = action.payload;
                // Check if exercise already exists
                const existingIndex = state.personalBests.findIndex(
                    (pb) => pb.exerciseId === newPR.exerciseId
                );

                if (existingIndex >= 0) {
                    // Replace if new weight is higher
                    if (newPR.maxWeight > state.personalBests[existingIndex].maxWeight) {
                        state.personalBests[existingIndex] = newPR;
                    }
                } else {
                    // Add new entry
                    state.personalBests.push(newPR);
                }

                // Re-sort by weight
                state.personalBests.sort((a, b) => b.maxWeight - a.maxWeight);
            })
            // Update manual personal best
            .addCase(personalBestsActions.updateManualPersonalBest.fulfilled, (state, action) => {
                const updatedPR = action.payload;
                const index = state.personalBests.findIndex(
                    (pb) => pb.manualId === updatedPR.manualId
                );

                if (index >= 0) {
                    state.personalBests[index] = updatedPR;
                    // Re-sort by weight
                    state.personalBests.sort((a, b) => b.maxWeight - a.maxWeight);
                }
            })
            // Delete manual personal best
            .addCase(personalBestsActions.deleteManualPersonalBest.fulfilled, (state, action) => {
                const deletedId = action.payload;
                state.personalBests = state.personalBests.filter(
                    (pb) => pb.manualId !== deletedId
                );
            });
    }),
};
