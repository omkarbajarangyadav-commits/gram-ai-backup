-- 1. Create or ensure 'worker' exists in user_role
-- Since altering enum type inside a transaction block can be tricky in some Postgres versions,
-- we use a DO block to safely add it.
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('farmer', 'agronomist', 'admin', 'worker');
  ELSE
    -- Add worker if it doesn't already exist in the enum mapping
    -- A simpler catch is just catching the duplicate object exception, but postgres native ALTER TYPE handles IF NOT EXISTS from v12+
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'worker';
  END IF;
END $$;

-- 2. Create users_profile if profile structure needs exact fields
-- (Note: If public.profiles exists, this allows an extension specifically mapped for Krishi Rozgar)
CREATE TABLE IF NOT EXISTS public.users_profile (
  id uuid references auth.users on delete cascade primary key,
  role user_role default 'farmer'::user_role,
  name text,
  phone text,
  district text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  employer_name text not null,
  location text not null,
  salary_per_day numeric not null,
  job_type text default 'daily', -- 'daily' or 'monthly'
  category text default 'labor', -- 'harvesting', 'machinery', 'labor', etc.
  phone text,
  description text,
  status text default 'active', -- 'active' or 'closed'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade not null
);

-- 4. Enable Row Level Security
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- 5. Policies for users_profile
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
  ON public.users_profile FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.users_profile FOR UPDATE 
  USING (auth.uid() = id);

-- 6. Policies for jobs table
-- Anyone (even unauthenticated) can view active jobs. 
-- For completely public:
CREATE POLICY "Anyone can view active jobs" 
  ON public.jobs FOR SELECT 
  USING (status = 'active');

-- Logged-in users can insert jobs
CREATE POLICY "Logged-in users can post jobs" 
  ON public.jobs FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Users can edit their own jobs
CREATE POLICY "Users can edit own jobs" 
  ON public.jobs FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own jobs
CREATE POLICY "Users can delete own jobs" 
  ON public.jobs FOR DELETE 
  USING (auth.uid() = user_id);

-- Admins can manage all jobs
-- Let's say we define an admin as having the role 'admin' in users_profile
CREATE POLICY "Admins can manage all jobs" 
  ON public.jobs FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users_profile
      WHERE users_profile.id = auth.uid() AND users_profile.role = 'admin'
    )
  );

-- 7. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);
