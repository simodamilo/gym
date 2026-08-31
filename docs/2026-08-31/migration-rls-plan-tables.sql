-- Close the missing RLS on the plan tables.
-- Date: 2026-08-31
--
-- days, day_exercises and day_exercise_sets predate the migrations kept in docs/ and were
-- reachable by any holder of the anon key with no authenticated user. That key ships inside
-- the public JS bundle, so this exposed every day name, exercise and set (weights, target
-- reps) to anyone, and the anon role also holds an INSERT grant on them.
--
-- Ownership is inherited up the chain rather than denormalised onto each table, matching
-- day_sessions/session_sets: day_exercise_sets -> day_exercises -> days -> workouts.user_id.
--
-- RUN THIS AGAINST A BACKUP FIRST, and confirm the app still works while logged in before
-- considering it done. If the app breaks, ALTER TABLE ... DISABLE ROW LEVEL SECURITY on the
-- offending table restores the previous behaviour immediately.

-- Pre-flight: see which tables are actually unprotected before changing anything.
--   SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
--   SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public';
--
-- If a table below already has a permissive policy (e.g. USING (true)) the DROP POLICY lines
-- must name it; the ones here only drop policies created by this file, so re-running is safe.

-- Wrapped in a transaction: if any statement fails, nothing is applied, so the tables can
-- never be left half-protected. The CREATE INDEX statements are non-concurrent and are
-- therefore safe inside the transaction.
BEGIN;

-- 0. Drop the pre-existing wide-open policies.
--
--    Confirmed present on 2026-08-31 via pg_policies: each of the three tables carried a
--    permissive policy with cmd = ALL and qual = true, i.e. every operation on every row for
--    everyone. RLS was already enabled, so these policies were the whole reason the tables
--    were readable with nothing but the public anon key. Note the names are not consistent
--    between tables. Permissive policies are ORed, so these MUST go: leaving one in place
--    makes every policy added below irrelevant.
DROP POLICY IF EXISTS "All permissions" ON days;
DROP POLICY IF EXISTS "All permissions" ON day_exercises;
DROP POLICY IF EXISTS "Permission all" ON day_exercise_sets;

-- 1. days -----------------------------------------------------------------
ALTER TABLE days ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own days" ON days;
CREATE POLICY "Users can view own days"
  ON days FOR SELECT USING (
    EXISTS (SELECT 1 FROM workouts w WHERE w.id = days.workout_id AND w.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert own days" ON days;
CREATE POLICY "Users can insert own days"
  ON days FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM workouts w WHERE w.id = days.workout_id AND w.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update own days" ON days;
CREATE POLICY "Users can update own days"
  ON days FOR UPDATE USING (
    EXISTS (SELECT 1 FROM workouts w WHERE w.id = days.workout_id AND w.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can delete own days" ON days;
CREATE POLICY "Users can delete own days"
  ON days FOR DELETE USING (
    EXISTS (SELECT 1 FROM workouts w WHERE w.id = days.workout_id AND w.user_id = auth.uid())
  );

-- 2. day_exercises --------------------------------------------------------
ALTER TABLE day_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own day exercises" ON day_exercises;
CREATE POLICY "Users can view own day exercises"
  ON day_exercises FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM days d
      JOIN workouts w ON w.id = d.workout_id
      WHERE d.id = day_exercises.day_id AND w.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own day exercises" ON day_exercises;
CREATE POLICY "Users can insert own day exercises"
  ON day_exercises FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM days d
      JOIN workouts w ON w.id = d.workout_id
      WHERE d.id = day_exercises.day_id AND w.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own day exercises" ON day_exercises;
CREATE POLICY "Users can update own day exercises"
  ON day_exercises FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM days d
      JOIN workouts w ON w.id = d.workout_id
      WHERE d.id = day_exercises.day_id AND w.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own day exercises" ON day_exercises;
CREATE POLICY "Users can delete own day exercises"
  ON day_exercises FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM days d
      JOIN workouts w ON w.id = d.workout_id
      WHERE d.id = day_exercises.day_id AND w.user_id = auth.uid()
    )
  );

-- 3. day_exercise_sets ----------------------------------------------------
ALTER TABLE day_exercise_sets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own day exercise sets" ON day_exercise_sets;
CREATE POLICY "Users can view own day exercise sets"
  ON day_exercise_sets FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM day_exercises de
      JOIN days d ON d.id = de.day_id
      JOIN workouts w ON w.id = d.workout_id
      WHERE de.id = day_exercise_sets.day_exercise_id AND w.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own day exercise sets" ON day_exercise_sets;
CREATE POLICY "Users can insert own day exercise sets"
  ON day_exercise_sets FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM day_exercises de
      JOIN days d ON d.id = de.day_id
      JOIN workouts w ON w.id = d.workout_id
      WHERE de.id = day_exercise_sets.day_exercise_id AND w.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own day exercise sets" ON day_exercise_sets;
CREATE POLICY "Users can update own day exercise sets"
  ON day_exercise_sets FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM day_exercises de
      JOIN days d ON d.id = de.day_id
      JOIN workouts w ON w.id = d.workout_id
      WHERE de.id = day_exercise_sets.day_exercise_id AND w.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own day exercise sets" ON day_exercise_sets;
CREATE POLICY "Users can delete own day exercise sets"
  ON day_exercise_sets FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM day_exercises de
      JOIN days d ON d.id = de.day_id
      JOIN workouts w ON w.id = d.workout_id
      WHERE de.id = day_exercise_sets.day_exercise_id AND w.user_id = auth.uid()
    )
  );

-- 4. Indexes the policies rely on.
--    Each policy is a lookup by the FK; without these, every row check is a seq scan.
CREATE INDEX IF NOT EXISTS idx_days_workout_id ON days(workout_id);
CREATE INDEX IF NOT EXISTS idx_day_exercises_day_id ON day_exercises(day_id);
CREATE INDEX IF NOT EXISTS idx_day_exercise_sets_day_exercise_id ON day_exercise_sets(day_exercise_id);

COMMIT;

-- 5. Verify: re-run the anon probe after applying. All three must return zero rows.
--    curl -H "apikey: $ANON" -H "Authorization: Bearer $ANON" \
--         "$URL/rest/v1/days?select=id&limit=1"
