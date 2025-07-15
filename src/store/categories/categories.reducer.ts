import { createReducer } from "@reduxjs/toolkit";
import type { CategoriesState } from "./types";
import { categoriesActions } from "./categories.actions";

const categoriesState: CategoriesState = {
  categories: [],
  isLoading: false,
  isError: false,
};

export const categoriesReducer = {
  categories: createReducer(categoriesState, (builder) => {
    builder
      .addCase(categoriesActions.fetchAllCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(categoriesActions.fetchAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(categoriesActions.fetchAllCategories.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  }),
};
