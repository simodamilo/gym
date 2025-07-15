export type ExercisesState = {
  exercises: Exercise[];
  isLoading: boolean;
  isError: boolean;
};

export interface Exercise {
  id: number;
  name: string;
  created: number;
  category_id: number;
}

export interface AddExercisePayload {
  name: string;
  created: number;
  category_id: number;
}
