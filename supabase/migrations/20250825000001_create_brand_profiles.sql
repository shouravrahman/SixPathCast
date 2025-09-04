-- Step 1: Drop the old trigger and function to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Create the new brand_profiles table
CREATE TABLE public.brand_profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at timestamptz,
  full_name text,
  bio text,
  industry text,
  target_audience text,
  website text,
  personality_traits text[],
  story text,
  projects jsonb,
  work_experiences jsonb,
  achievements text[],
  tone text,
  writing_style text,
  content_style text,
  language_guidelines text,
  words_to_avoid text[],
  words_to_prefer text[],
  topics text[],
  hashtags text[],
  brand_colors jsonb,
  logo_url text,
  profile_image_url text,
  personal_photo_urls text[],
  has_completed_onboarding boolean DEFAULT false
);

-- Step 3: Enable Row Level Security on the new table
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies for brand_profiles
CREATE POLICY "Users can view their own brand profile."
  ON public.brand_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own brand profile."
  ON public.brand_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own brand profile."
  ON public.brand_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Step 5: Create a function to automatically update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.handle_brand_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create a trigger to call the timestamp update function
CREATE TRIGGER on_brand_profile_update
  BEFORE UPDATE ON public.brand_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_brand_profile_update();

-- Step 7: Create a new function to populate both 'profiles' and 'brand_profiles' for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user_setup()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a row in public.profiles for role management
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'user');
  
  -- Create a row in public.brand_profiles for brand settings
  INSERT INTO public.brand_profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Create the new trigger on the auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_setup();
