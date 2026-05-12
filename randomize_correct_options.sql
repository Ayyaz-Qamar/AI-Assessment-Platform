-- =====================================================
-- B-BIAS FIX: Randomize correct_option distribution
-- =====================================================
-- Problem: Existing seed had ~85% of correct answers on option B.
-- Fix: For each question, deterministically remap A/B/C/D based on
--      question ID hash. Options' TEXT is shuffled accordingly so the
--      correct answer keeps pointing to the same content,
--      just at a different letter.
--
-- Strategy:
--   1. For each question, pick a new target letter (round-robin A/B/C/D
--      using question id modulo 4).
--   2. Swap option text columns to move the current correct option's
--      content to the new target letter slot, and move the displaced
--      option's content to the slot the correct option came from.
--   3. Update correct_option to the new target letter.
--
-- This is idempotent: running twice gives a uniform A/B/C/D distribution.
-- =====================================================

DO $$
DECLARE
    rec RECORD;
    target_letter CHAR(1);
    current_letter CHAR(1);
    col_current TEXT;
    col_target TEXT;
    val_correct TEXT;
    val_target  TEXT;
    sql_swap    TEXT;
BEGIN
    FOR rec IN SELECT id, correct_option, option_a, option_b, option_c, option_d
               FROM questions
               ORDER BY id
    LOOP
        -- Compute target letter from question id (uniform A/B/C/D)
        target_letter := CASE (rec.id % 4)
                            WHEN 0 THEN 'A'
                            WHEN 1 THEN 'B'
                            WHEN 2 THEN 'C'
                            WHEN 3 THEN 'D'
                         END;
        current_letter := UPPER(rec.correct_option);

        -- Skip if already at target
        IF current_letter = target_letter THEN
            CONTINUE;
        END IF;

        -- Get the two values we need to swap
        col_current := 'option_' || LOWER(current_letter);
        col_target  := 'option_' || LOWER(target_letter);

        EXECUTE format('SELECT %I FROM questions WHERE id = $1', col_current)
            INTO val_correct USING rec.id;
        EXECUTE format('SELECT %I FROM questions WHERE id = $1', col_target)
            INTO val_target USING rec.id;

        -- Swap the two columns
        sql_swap := format(
            'UPDATE questions SET %I = $1, %I = $2, correct_option = $3 WHERE id = $4',
            col_target, col_current
        );
        EXECUTE sql_swap USING val_correct, val_target, target_letter, rec.id;
    END LOOP;
END $$;

-- =====================================================
-- Verify: should show roughly even A/B/C/D distribution
-- =====================================================
SELECT correct_option, COUNT(*) AS count
FROM questions
GROUP BY correct_option
ORDER BY correct_option;
