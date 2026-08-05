-- Make the exercise catalog global, with per-user private exercises on top.
-- Date: 2026-08-05
--
-- PHASE 1 of 2. This file is safe to run before deploying the new app code:
-- exercises_catalog.show_in_personal_best is left in place so the currently
-- deployed client keeps working. Run migration-drop-show-in-personal-best.sql
-- only after the new code is live.

-- 1. Per-user preferences for which exercises appear in the personal-bests list.
--    Kept separate from manual_personal_bests: that table means "the user typed in a
--    PR weight" (weight is NOT NULL), while this flag must also cover exercises with
--    no PR at all.
CREATE TABLE IF NOT EXISTS user_exercise_prefs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL REFERENCES exercises_catalog(id) ON DELETE CASCADE,
  show_in_personal_best BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, exercise_id)
);

CREATE INDEX IF NOT EXISTS idx_user_exercise_prefs_user_id ON user_exercise_prefs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_exercise_prefs_exercise_id ON user_exercise_prefs(exercise_id);

ALTER TABLE user_exercise_prefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own exercise prefs"
  ON user_exercise_prefs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own exercise prefs"
  ON user_exercise_prefs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own exercise prefs"
  ON user_exercise_prefs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own exercise prefs"
  ON user_exercise_prefs FOR DELETE USING (auth.uid() = user_id);

-- Reuses the trigger function created by migration-add-manual-personal-bests.sql
CREATE TRIGGER update_user_exercise_prefs_updated_at
  BEFORE UPDATE ON user_exercise_prefs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 2. Preserve every user's current PR list before the flag stops being read
--    from exercises_catalog.
INSERT INTO user_exercise_prefs (user_id, exercise_id, show_in_personal_best)
SELECT user_id, id, COALESCE(show_in_personal_best, false)
FROM exercises_catalog
WHERE user_id IS NOT NULL
ON CONFLICT (user_id, exercise_id) DO NOTHING;

-- 3. Promote every existing exercise to the global catalog.
--    Safe as a blanket UPDATE only because there is a single user today; with
--    multiple users this would need dedup by name plus repointing
--    day_exercises.exercises_catalog_id at the surviving rows.
UPDATE exercises_catalog SET user_id = NULL;

-- 4. Replace the single ALL policy with per-command policies.
--    Required, not cosmetic: under "user_id = auth.uid()" a global row evaluates
--    NULL = auth.uid() -> NULL -> not true, so global rows would be invisible to everyone.
DROP POLICY IF EXISTS "Only you own data" ON exercises_catalog;

CREATE POLICY "Read global and own exercises"
  ON exercises_catalog FOR SELECT
  USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Insert own exercises"
  ON exercises_catalog FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Update own exercises"
  ON exercises_catalog FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Delete own exercises"
  ON exercises_catalog FOR DELETE
  USING (user_id = auth.uid());

COMMENT ON COLUMN exercises_catalog.user_id IS
  'NULL = global exercise visible to all users and immutable from the app; set = private exercise owned by that user';
COMMENT ON TABLE user_exercise_prefs IS
  'Per-user settings for catalog exercises, e.g. whether an exercise appears in their personal bests';
