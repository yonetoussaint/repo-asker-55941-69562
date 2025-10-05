
-- Fix the handle_new_user function to populate profile data from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(
      excluded.full_name,
      profiles.full_name,
      split_part((SELECT email FROM auth.users WHERE id = excluded.id), '@', 1)
    ),
    avatar_url = COALESCE(excluded.avatar_url, profiles.avatar_url);
  RETURN new;
END;
$$;

-- Backfill existing profiles with data from auth.users (one by one to avoid constraint issues)
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT 
      u.id,
      u.email,
      u.raw_user_meta_data
    FROM auth.users u
    JOIN profiles p ON u.id = p.id
    WHERE p.full_name IS NULL
  LOOP
    UPDATE profiles
    SET 
      full_name = COALESCE(
        user_record.raw_user_meta_data->>'full_name',
        user_record.raw_user_meta_data->>'name',
        user_record.raw_user_meta_data->>'username',
        split_part(user_record.email, '@', 1)
      ),
      avatar_url = COALESCE(avatar_url, user_record.raw_user_meta_data->>'avatar_url')
    WHERE id = user_record.id;
  END LOOP;
END $$;
