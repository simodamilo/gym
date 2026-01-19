-- Create manual_personal_bests table
-- This table stores manually-entered personal bests by users
-- Date: 2026-01-19

CREATE TABLE IF NOT EXISTS manual_personal_bests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL REFERENCES exercises_catalog(id) ON DELETE CASCADE,
  weight DECIMAL(5,1) NOT NULL CHECK (weight >= 0.5 AND weight <= 999.9),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, exercise_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_manual_pbs_user_id ON manual_personal_bests(user_id);
CREATE INDEX idx_manual_pbs_exercise_id ON manual_personal_bests(exercise_id);

-- Enable Row Level Security
ALTER TABLE manual_personal_bests ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own manual PRs
CREATE POLICY "Users can view own manual PRs"
  ON manual_personal_bests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own manual PRs"
  ON manual_personal_bests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own manual PRs"
  ON manual_personal_bests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own manual PRs"
  ON manual_personal_bests FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
-- This function can be reused for other tables as well
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER update_manual_personal_bests_updated_at
  BEFORE UPDATE ON manual_personal_bests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE manual_personal_bests IS 'Stores manually-entered personal best records for exercises';
COMMENT ON COLUMN manual_personal_bests.user_id IS 'References the user who created this personal best';
COMMENT ON COLUMN manual_personal_bests.exercise_id IS 'References the exercise for this personal best';
COMMENT ON COLUMN manual_personal_bests.weight IS 'The personal best weight in kg (0.5 - 999.9)';
COMMENT ON COLUMN manual_personal_bests.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN manual_personal_bests.updated_at IS 'Timestamp when the record was last updated';
