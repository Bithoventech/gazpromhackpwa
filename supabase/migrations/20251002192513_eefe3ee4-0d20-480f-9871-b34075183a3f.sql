-- Drop old recursive policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Drop recursive policies on other tables
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_daily_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_daily_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_daily_progress;
DROP POLICY IF EXISTS "Users can view their own collection" ON public.scammer_collection;
DROP POLICY IF EXISTS "Users can insert to their collection" ON public.scammer_collection;
DROP POLICY IF EXISTS "Users can insert their leaderboard entry" ON public.leaderboard;
DROP POLICY IF EXISTS "Users can update their leaderboard entry" ON public.leaderboard;

-- Create security definer function to get current user by device_id
CREATE OR REPLACE FUNCTION public.get_user_id_by_device(device_id_param TEXT)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE device_id = device_id_param LIMIT 1;
$$;

-- Create simpler policies for profiles (no recursion)
CREATE POLICY "Anyone can view profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update profiles"
  ON public.profiles FOR UPDATE
  USING (true);

-- Policies for user_daily_progress (no recursion)
CREATE POLICY "Anyone can view their progress"
  ON public.user_daily_progress FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert their progress"
  ON public.user_daily_progress FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update their progress"
  ON public.user_daily_progress FOR UPDATE
  USING (true);

-- Policies for scammer_collection (no recursion)
CREATE POLICY "Anyone can view their collection"
  ON public.scammer_collection FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert to collection"
  ON public.scammer_collection FOR INSERT
  WITH CHECK (true);

-- Policies for leaderboard (already has public read)
CREATE POLICY "Anyone can insert leaderboard"
  ON public.leaderboard FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update leaderboard"
  ON public.leaderboard FOR UPDATE
  USING (true);