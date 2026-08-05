-- PHASE 2 of 2. Date: 2026-08-05
--
-- DESTRUCTIVE. Run this ONLY after the new app code is deployed and verified.
-- Until then the previously deployed client still reads this column, and dropping
-- it early breaks personal bests for any open browser tab running the old bundle.
--
-- Verify the backfill landed before running:
--   SELECT count(*) FROM user_exercise_prefs WHERE show_in_personal_best;

ALTER TABLE exercises_catalog DROP COLUMN show_in_personal_best;
