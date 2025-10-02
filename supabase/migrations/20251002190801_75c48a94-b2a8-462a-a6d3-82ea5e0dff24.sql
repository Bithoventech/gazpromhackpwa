-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table (device_id + name registration)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  total_coins INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create daily_scammers table (pool of 5 scammers)
CREATE TABLE public.daily_scammers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  role TEXT NOT NULL, -- "ФСБшник", "банкир", etc.
  biography TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level BETWEEN 1 AND 10),
  avatar_url TEXT,
  contradictions JSONB DEFAULT '[]'::jsonb, -- Known weak points
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create active_daily_quest table (current active scammer)
CREATE TABLE public.active_daily_quest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scammer_id UUID REFERENCES public.daily_scammers(id) ON DELETE CASCADE NOT NULL,
  quest_date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_daily_progress table
CREATE TABLE public.user_daily_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  quest_date DATE NOT NULL,
  scammer_id UUID REFERENCES public.daily_scammers(id) ON DELETE CASCADE NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  flags_found JSONB DEFAULT '[]'::jsonb,
  completed BOOLEAN DEFAULT FALSE,
  completion_time TIMESTAMP WITH TIME ZONE,
  coins_earned INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quest_date)
);

-- Create scammer_collection table
CREATE TABLE public.scammer_collection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  scammer_id UUID REFERENCES public.daily_scammers(id) ON DELETE CASCADE NOT NULL,
  exposed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  chat_log JSONB DEFAULT '[]'::jsonb,
  post_chat_qa JSONB DEFAULT '[]'::jsonb,
  UNIQUE(user_id, scammer_id)
);

-- Create leaderboard table
CREATE TABLE public.leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  total_exposures INTEGER DEFAULT 0,
  fastest_time INTEGER, -- seconds
  streak_days INTEGER DEFAULT 0,
  last_completed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_scammers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_daily_quest ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scammer_collection ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (id = (SELECT id FROM public.profiles WHERE device_id = current_setting('request.headers')::json->>'x-device-id'));

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (id = (SELECT id FROM public.profiles WHERE device_id = current_setting('request.headers')::json->>'x-device-id'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (user_id = (SELECT id FROM public.profiles WHERE device_id = current_setting('request.headers')::json->>'x-device-id'));

-- RLS Policies for daily_scammers (read-only for all)
CREATE POLICY "Everyone can view scammers"
  ON public.daily_scammers FOR SELECT
  USING (true);

-- RLS Policies for active_daily_quest (read-only for all)
CREATE POLICY "Everyone can view active quest"
  ON public.active_daily_quest FOR SELECT
  USING (true);

-- RLS Policies for user_daily_progress
CREATE POLICY "Users can view their own progress"
  ON public.user_daily_progress FOR SELECT
  USING (user_id = (SELECT id FROM public.profiles WHERE device_id = current_setting('request.headers')::json->>'x-device-id'));

CREATE POLICY "Users can insert their own progress"
  ON public.user_daily_progress FOR INSERT
  WITH CHECK (user_id = (SELECT id FROM public.profiles WHERE device_id = current_setting('request.headers')::json->>'x-device-id'));

CREATE POLICY "Users can update their own progress"
  ON public.user_daily_progress FOR UPDATE
  USING (user_id = (SELECT id FROM public.profiles WHERE device_id = current_setting('request.headers')::json->>'x-device-id'));

-- RLS Policies for scammer_collection
CREATE POLICY "Users can view their own collection"
  ON public.scammer_collection FOR SELECT
  USING (user_id = (SELECT id FROM public.profiles WHERE device_id = current_setting('request.headers')::json->>'x-device-id'));

CREATE POLICY "Users can insert to their collection"
  ON public.scammer_collection FOR INSERT
  WITH CHECK (user_id = (SELECT id FROM public.profiles WHERE device_id = current_setting('request.headers')::json->>'x-device-id'));

-- RLS Policies for leaderboard (everyone can read)
CREATE POLICY "Everyone can view leaderboard"
  ON public.leaderboard FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their leaderboard entry"
  ON public.leaderboard FOR INSERT
  WITH CHECK (user_id = (SELECT id FROM public.profiles WHERE device_id = current_setting('request.headers')::json->>'x-device-id'));

CREATE POLICY "Users can update their leaderboard entry"
  ON public.leaderboard FOR UPDATE
  USING (user_id = (SELECT id FROM public.profiles WHERE device_id = current_setting('request.headers')::json->>'x-device-id'));

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_daily_progress_updated_at
  BEFORE UPDATE ON public.user_daily_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leaderboard_updated_at
  BEFORE UPDATE ON public.leaderboard
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();