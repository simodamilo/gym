export type ExercisesState = {
  exercises: Exercise[];
  isLoading: boolean;
  isError: boolean;
};

export interface Exercise {
  id: number;
  created_at: number;
  name: string;
}
