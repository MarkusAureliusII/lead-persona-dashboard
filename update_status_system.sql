-- Update leads table to use new status values
-- First, let's see current status values
SELECT DISTINCT status FROM leads;

-- Update existing status values to new system
UPDATE leads 
SET status = 'ready_for_outreach' 
WHERE status = 'qualified';

UPDATE leads 
SET status = 'contacted' 
WHERE status = 'contacted';

-- Keep 'new' status as is
-- UPDATE leads SET status = 'new' WHERE status = 'new';

-- Optional: Add constraint for valid status values
ALTER TABLE leads 
DROP CONSTRAINT IF EXISTS leads_status_check;

ALTER TABLE leads 
ADD CONSTRAINT leads_status_check 
CHECK (status IN ('new', 'email_verified', 'enriched', 'personalized', 'ready_for_outreach', 'contacted'));
