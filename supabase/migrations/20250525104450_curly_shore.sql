/*
  # Create initial schema for Event Management System

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, not null)
      - `full_name` (text)
      - `role` (text, not null, default 'customer')
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    - `events`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, not null)
      - `date_time` (timestamptz, not null)
      - `location` (text, not null)
      - `category` (text, not null)
      - `image_url` (text)
      - `status` (text, not null, default 'pending')
      - `created_by` (uuid, references profiles.id)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    - `participants`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events.id)
      - `participant_name` (text, not null)
      - `participant_email` (text, not null)
      - `added_at` (timestamptz, default now())
      - `added_by` (uuid, references profiles.id)
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for admins to manage all data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL,
  participant_email TEXT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT now(),
  added_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  UNIQUE(event_id, participant_email)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Events policies
CREATE POLICY "Anyone can view approved events"
  ON events
  FOR SELECT
  TO authenticated
  USING (status = 'approved' OR created_by = auth.uid());

CREATE POLICY "Customers can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Customers can update their pending events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid() AND status = 'pending')
  WITH CHECK (created_by = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can update any event"
  ON events
  FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Customers can delete their pending events"
  ON events
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can delete any event"
  ON events
  FOR DELETE
  TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Participants policies
CREATE POLICY "Anyone can view participants of approved events"
  ON participants
  FOR SELECT
  TO authenticated
  USING (
    event_id IN (
      SELECT id FROM events WHERE status = 'approved' OR created_by = auth.uid()
    )
  );

CREATE POLICY "Customers can add participants to their approved events"
  ON participants
  FOR INSERT
  TO authenticated
  WITH CHECK (
    event_id IN (
      SELECT id FROM events 
      WHERE status = 'approved' AND created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can add participants to any approved event"
  ON participants
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' AND
    event_id IN (SELECT id FROM events WHERE status = 'approved')
  );

CREATE POLICY "Customers can delete participants from their events"
  ON participants
  FOR DELETE
  TO authenticated
  USING (
    event_id IN (
      SELECT id FROM events WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can delete any participant"
  ON participants
  FOR DELETE
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();