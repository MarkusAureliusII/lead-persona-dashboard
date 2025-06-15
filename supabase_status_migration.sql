-- Lead Status System Migration
-- Run this in Supabase SQL Editor

-- 1. Check current status distribution
SELECT 'Current Status Distribution:' as info;
SELECT status, COUNT(*) as count 
FROM leads 
GROUP BY status 
ORDER BY count DESC;

-- 2. Update existing records to new status system
UPDATE leads 
SET status = CASE 
  WHEN status = 'qualified' THEN 'ready_for_outreach'
  WHEN status = 'contacted' THEN 'contacted'
  WHEN status = 'new' THEN 'new'
  ELSE 'new'  -- Default fallback for any unexpected values
END;

-- 3. Verify the update
SELECT 'After Update:' as info;
SELECT status, COUNT(*) as count 
FROM leads 
GROUP BY status 
ORDER BY count DESC;

-- 4. Add constraint for valid status values (recommended)
ALTER TABLE leads 
DROP CONSTRAINT IF EXISTS leads_status_check;

ALTER TABLE leads 
ADD CONSTRAINT leads_status_check 
CHECK (status IN (
  'new', 
  'email_verified', 
  'enriched', 
  'personalized', 
  'ready_for_outreach', 
  'contacted'
));

-- 5. Set default value for new records
ALTER TABLE leads 
ALTER COLUMN status SET DEFAULT 'new';

SELECT 'Migration completed successfully!' as result;