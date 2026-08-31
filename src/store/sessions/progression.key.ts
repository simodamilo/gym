/**
 * Progressions are cached per exercise *and* per workout: the same catalog exercise used in two
 * workouts has two independent histories, so a single exercise-id key would let one overwrite
 * the other.
 */
export const getProgressionKey = (exerciseId: string, workoutId: string): string => `${exerciseId}:${workoutId}`;
