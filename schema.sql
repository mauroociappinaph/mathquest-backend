-- MathQuest Database Schema

-- 1. Enums
CREATE TYPE user_role AS ENUM ('admin', 'parent', 'child');

-- 2. Profiles Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uid UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'parent',
    parent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    avatar_url TEXT
);

-- 3. Multiplication Tables
CREATE TABLE public.multiplication_tables (
    id SERIAL PRIMARY KEY,
    number INTEGER NOT NULL UNIQUE CHECK (number >= 1 AND number <= 12)
);

-- Insert tables 1-12
INSERT INTO public.multiplication_tables (number) SELECT generate_series(1, 12);

-- 4. Progress Table
CREATE TABLE public.progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    table_id INTEGER REFERENCES public.multiplication_tables(id) ON DELETE CASCADE NOT NULL,
    score INTEGER DEFAULT 0,
    mastery_level INTEGER DEFAULT 0, -- 0-100
    last_practiced TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(child_id, table_id)
);

-- 5. Game Sessions
CREATE TABLE public.game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    score INTEGER NOT NULL,
    duration INTEGER NOT NULL, -- in seconds
    correct_answers INTEGER DEFAULT 0,
    wrong_answers INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. RLS Policies

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile and their children"
ON public.profiles FOR SELECT
USING (
    auth.uid() = uid OR
    auth.uid() IN (SELECT uid FROM public.profiles WHERE id = profiles.parent_id)
);

-- Trigger for new auth users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (uid, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'parent');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
