-- Execute this SQL in Supabase Dashboard -> SQL Editor to enable 'arrived' and 'blocked' statuses

ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS appointments_status_check;

ALTER TABLE public.appointments ADD CONSTRAINT appointments_status_check 
CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show', 'arrived', 'blocked'));

-- Optional: Add color support if needed later
-- ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS color text;
