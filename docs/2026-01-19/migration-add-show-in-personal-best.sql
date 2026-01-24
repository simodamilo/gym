-- Migration: Add show_in_personal_best field to exercises_catalog table
-- Date: 2026-01-19
-- Description: Allows users to choose which exercises to track in personal bests

-- Add the new column with default value false
ALTER TABLE exercises_catalog
ADD COLUMN IF NOT EXISTS show_in_personal_best BOOLEAN DEFAULT false;

-- Optional: Update existing exercises to have this field set to false
UPDATE exercises_catalog
SET show_in_personal_best = false
WHERE show_in_personal_best IS NULL;

-- Add a comment to document the column
COMMENT ON COLUMN exercises_catalog.show_in_personal_best IS 'Indicates if this exercise should be tracked in personal bests display';
