import type { RootState } from "../reducer.config";
import type { Category } from "./types";

const getCategories = (state: RootState): Category[] => {
  return state.categories.categories;
};

export const categoriesSelectors = {
  getCategories,
};
