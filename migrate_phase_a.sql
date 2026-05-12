-- =====================================================
-- Phase A Migration
-- 1. Make answers.selected_option nullable (for timer timeouts)
-- 2. Add answers.timed_out boolean column
-- =====================================================

-- Step 1: Allow NULL on selected_option
ALTER TABLE answers
    ALTER COLUMN selected_option DROP NOT NULL;

-- Step 2: Add timed_out column with default false (won't break existing rows)
ALTER TABLE answers
    ADD COLUMN IF NOT EXISTS timed_out BOOLEAN DEFAULT FALSE NOT NULL;

-- Verify
SELECT column_name, is_nullable, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'answers'
ORDER BY ordinal_position;
