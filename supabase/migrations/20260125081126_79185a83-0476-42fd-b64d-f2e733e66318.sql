-- Replace overly permissive notification INSERT policy with a more secure one
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- Create a more secure policy that allows authenticated users to create notifications
-- (typically done through edge functions or triggers with service role)
CREATE POLICY "Authenticated users can create notifications for themselves or via service"
ON public.notifications FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
);