export type CategoriesState = {
  categories: Category[];
  isLoading: boolean;
  isError: boolean;
};

export interface Category {
  id: number;
  name: string;
}
