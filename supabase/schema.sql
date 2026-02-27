-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enum for User Roles
create type user_role as enum ('farmer', 'agronomist', 'admin');

-- Use Supabase's built-in auth.users table for profiles
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role user_role default 'farmer'::user_role,
  full_name text,
  phone text,
  avatar_url text,
  subscription_plan text default 'free', -- 'free', 'pro_farmer', 'agronomist'
  subscription_status text default 'active',
  stripe_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Farms table (Multi-tenant)
create table public.farms (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  location jsonb, -- { lat: float, lng: float, address: text }
  size_hectares numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Crops table
create table public.crops (
  id uuid default uuid_generate_v4() primary key,
  farm_id uuid references public.farms(id) on delete cascade not null,
  name text not null,
  variety text,
  planted_at date,
  expected_harvest_date date,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- AI Disease Scans Logs
create table public.disease_scans (
  id uuid default uuid_generate_v4() primary key,
  farmer_id uuid references public.profiles(id) not null,
  crop_id uuid references public.crops(id),
  image_url text not null,
  ai_prediction jsonb not null, -- { disease: "Blight", confidence: 0.95, remedy: "Apply copper fungicide." }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Irrigation Logs
create table public.irrigation_logs (
  id uuid default uuid_generate_v4() primary key,
  farm_id uuid references public.farms(id) on delete cascade not null,
  water_amount_liters numeric not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-------------------------------------------------------

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.farms enable row level security;
alter table public.crops enable row level security;
alter table public.disease_scans enable row level security;
alter table public.irrigation_logs enable row level security;

-- Profiles: Users can view and update their own profile. Admins can view all.
create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Farms: Users can perform CRUD on their own farms.
create policy "Users can view their own farms"
  on public.farms for select
  using ( auth.uid() = owner_id );

create policy "Users can create their own farms"
  on public.farms for insert
  with check ( auth.uid() = owner_id );

create policy "Users can update their own farms"
  on public.farms for update
  using ( auth.uid() = owner_id );

create policy "Users can delete their own farms"
  on public.farms for delete
  using ( auth.uid() = owner_id );

-- Crops: Users can perform CRUD on crops belonging to their farms.
create policy "Users can view crops of their farms"
  on public.crops for select
  using ( farm_id in (select id from public.farms where owner_id = auth.uid()) );

create policy "Users can insert crops to their farms"
  on public.crops for insert
  with check ( farm_id in (select id from public.farms where owner_id = auth.uid()) );

create policy "Users can update crops of their farms"
  on public.crops for update
  using ( farm_id in (select id from public.farms where owner_id = auth.uid()) );

create policy "Users can delete crops of their farms"
  on public.crops for delete
  using ( farm_id in (select id from public.farms where owner_id = auth.uid()) );

-- Disease Scans: Users can view and create their own scans.
create policy "Users can view own scans"
  on public.disease_scans for select
  using ( auth.uid() = farmer_id );

create policy "Users can create own scans"
  on public.disease_scans for insert
  with check ( auth.uid() = farmer_id );

-- Irrigation Logs: Users can view and create logs for their farms
create policy "Users can view irrigation logs of their farms"
  on public.irrigation_logs for select
  using ( farm_id in (select id from public.farms where owner_id = auth.uid()) );

create policy "Users can insert irrigation logs to their farms"
  on public.irrigation_logs for insert
  with check ( farm_id in (select id from public.farms where owner_id = auth.uid()) );

-------------------------------------------------------
-- TRIGGERS
-------------------------------------------------------
-- Create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', coalesce((new.raw_user_meta_data->>'role')::user_role, 'farmer'::user_role));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
