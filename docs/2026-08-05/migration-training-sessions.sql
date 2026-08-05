-- Track every training as its own row, so weight AND reps progression can be charted.
-- Date: 2026-08-05
--
-- PHASE 1 of 2. Safe to run before deploying the new app code: this file is purely
-- additive. day_exercise_sets.base_weight, days.counter and days.last_workout are
-- left in place and keep being written by the new code, so a rollback stays possible.
-- A later migration drops them once the new code is proven live.

-- 1. One row per training started for a given day.
--
--    id / workout_id / day_id are TEXT, not UUID: workouts.id, days.id, day_exercises.id and
--    day_exercise_sets.id are all TEXT in this schema (the client generates them with uuidv4()
--    and they are stored as text). user_id stays UUID because auth.users.id is UUID.
CREATE TABLE IF NOT EXISTS day_sessions (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id TEXT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  day_id TEXT NOT NULL REFERENCES days(id) ON DELETE CASCADE,
  session_number INT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(day_id, session_number)
);

CREATE INDEX IF NOT EXISTS idx_day_sessions_day_id ON day_sessions(day_id, session_number);
CREATE INDEX IF NOT EXISTS idx_day_sessions_user_id ON day_sessions(user_id, started_at DESC);

-- 2. What was actually performed, one row per set per session.
--
--    Points at day_exercise_id, NOT at day_exercise_sets.id: sets are added, removed and
--    renumbered as the plan is edited, so a set id is not a stable identity for history.
--    (day_exercise_id, set_number) is.
--
--    reps vs reps_raw: charting needs a number, but reps_type does not always yield one
--    ('custom' is free text, 'time' is seconds). reps_raw always keeps what the user typed;
--    reps is the parsed value and is NULL when it cannot be parsed.
--
--    reps_type and target_reps are snapshotted so historical rows keep their meaning if the
--    exercise is later switched from e.g. reps to time.
CREATE TABLE IF NOT EXISTS session_sets (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  session_id TEXT NOT NULL REFERENCES day_sessions(id) ON DELETE CASCADE,
  day_exercise_id TEXT NOT NULL REFERENCES day_exercises(id) ON DELETE CASCADE,
  set_number INT NOT NULL,
  weight NUMERIC,
  reps INT,
  reps_raw TEXT,
  target_reps TEXT,
  reps_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, day_exercise_id, set_number)
);

CREATE INDEX IF NOT EXISTS idx_session_sets_session_id ON session_sets(session_id);
CREATE INDEX IF NOT EXISTS idx_session_sets_day_exercise_id ON session_sets(day_exercise_id);

-- 3. RLS.
ALTER TABLE day_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON day_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions"
  ON day_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions"
  ON day_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sessions"
  ON day_sessions FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE session_sets ENABLE ROW LEVEL SECURITY;

-- session_sets has no user_id of its own; ownership is inherited from the parent session.
CREATE POLICY "Users can view own session sets"
  ON session_sets FOR SELECT USING (
    EXISTS (SELECT 1 FROM day_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
  );
CREATE POLICY "Users can insert own session sets"
  ON session_sets FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM day_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
  );
CREATE POLICY "Users can update own session sets"
  ON session_sets FOR UPDATE USING (
    EXISTS (SELECT 1 FROM day_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
  );
CREATE POLICY "Users can delete own session sets"
  ON session_sets FOR DELETE USING (
    EXISTS (SELECT 1 FROM day_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
  );

-- 4. Backfill.
--
--    Existing data supports at most two synthetic sessions per day: one from base_weight and
--    one from the current weight. Everything in between is unrecoverable, and NO reps history
--    can be reconstructed because reps was never recorded as a performed value — only as a
--    target. reps is therefore left NULL and target_reps carries the prescription.

--    The two date expressions below cast through ::text on purpose. days.created_at may be a
--    timestamp while days.last_workout is an epoch in milliseconds (the client writes
--    Date.getTime()), and either may be stored as text in this schema. Casting to text first and
--    branching on whether the value is all digits works for both without knowing the column type.

-- 4a. Session 1, from base_weight, dated at the day's creation.
INSERT INTO day_sessions (user_id, workout_id, day_id, session_number, started_at, completed_at, notes)
SELECT w.user_id, w.id, d.id, 1,
       CASE WHEN d.created_at::text ~ '^\d+$'
            THEN TO_TIMESTAMP(d.created_at::text::bigint / 1000.0)
            ELSE d.created_at::text::timestamptz END,
       CASE WHEN d.created_at::text ~ '^\d+$'
            THEN TO_TIMESTAMP(d.created_at::text::bigint / 1000.0)
            ELSE d.created_at::text::timestamptz END,
       'Backfilled from base_weight'
FROM days d
JOIN workouts w ON w.id = d.workout_id
WHERE EXISTS (
  SELECT 1 FROM day_exercises de
  JOIN day_exercise_sets s ON s.day_exercise_id = de.id
  WHERE de.day_id = d.id AND s.base_weight IS NOT NULL
)
ON CONFLICT (day_id, session_number) DO NOTHING;

INSERT INTO session_sets (session_id, day_exercise_id, set_number, weight, reps, reps_raw, target_reps, reps_type)
SELECT ds.id, de.id, s.set_number, s.base_weight, NULL, NULL, s.reps, de.reps_type
FROM day_sessions ds
JOIN day_exercises de ON de.day_id = ds.day_id
JOIN day_exercise_sets s ON s.day_exercise_id = de.id
WHERE ds.session_number = 1
  AND ds.notes = 'Backfilled from base_weight'
  AND s.base_weight IS NOT NULL
ON CONFLICT (session_id, day_exercise_id, set_number) DO NOTHING;

-- 4b. Latest session, from the current weight, dated at last_workout.
--     Only for days where the current weight actually differs from base_weight — otherwise
--     session 1 already represents it.
INSERT INTO day_sessions (user_id, workout_id, day_id, session_number, started_at, completed_at, notes)
SELECT w.user_id, w.id, d.id, GREATEST(COALESCE(d.counter, 1), 2),
       TO_TIMESTAMP(NULLIF(regexp_replace(d.last_workout::text, '\D', '', 'g'), '')::bigint / 1000.0),
       TO_TIMESTAMP(NULLIF(regexp_replace(d.last_workout::text, '\D', '', 'g'), '')::bigint / 1000.0),
       'Backfilled from current weight'
FROM days d
JOIN workouts w ON w.id = d.workout_id
WHERE d.last_workout IS NOT NULL
  -- started_at is NOT NULL, so skip any last_workout that does not yield a number.
  AND NULLIF(regexp_replace(d.last_workout::text, '\D', '', 'g'), '') IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM day_exercises de
    JOIN day_exercise_sets s ON s.day_exercise_id = de.id
    WHERE de.day_id = d.id
      AND s.weight IS NOT NULL
      AND s.weight IS DISTINCT FROM s.base_weight
  )
ON CONFLICT (day_id, session_number) DO NOTHING;

INSERT INTO session_sets (session_id, day_exercise_id, set_number, weight, reps, reps_raw, target_reps, reps_type)
SELECT ds.id, de.id, s.set_number, s.weight, NULL, NULL, s.reps, de.reps_type
FROM day_sessions ds
JOIN day_exercises de ON de.day_id = ds.day_id
JOIN day_exercise_sets s ON s.day_exercise_id = de.id
WHERE ds.notes = 'Backfilled from current weight'
  AND s.weight IS NOT NULL
ON CONFLICT (session_id, day_exercise_id, set_number) DO NOTHING;

COMMENT ON TABLE day_sessions IS
  'One row per training started for a day. days.counter and days.last_workout are derivable from this table and will be dropped in phase 2.';
COMMENT ON TABLE session_sets IS
  'Actually performed weight and reps per set per session. day_exercise_sets remains the plan/prescription.';
COMMENT ON COLUMN session_sets.reps IS
  'Parsed performed reps, NULL when reps_raw is not numeric (reps_type = custom, or free text). Chart only non-NULL rows.';
COMMENT ON COLUMN session_sets.reps_raw IS
  'Verbatim user input, always kept even when reps could not be parsed.';
