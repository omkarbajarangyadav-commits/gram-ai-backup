-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends Auth)
create type user_role as enum ('farmer', 'shop_owner', 'worker');

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  role user_role default 'farmer',
  full_name text,
  phone text,
  location text,
  avatar_url text, -- For profile pictures
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. SHOPS (For Fertilizer/Seed Shops)
create table shops (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  category text not null, -- e.g., 'Fertilizer', 'Seeds', 'Tools'
  description text,
  phone text not null,
  address text,
  image_url text,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PRODUCTS (Items inside a Shop)
create table products (
  id uuid default uuid_generate_v4() primary key,
  shop_id uuid references shops(id) on delete cascade not null,
  name text not null,
  price numeric not null,
  unit text not null, -- e.g., 'kg', 'bag', 'liter'
  in_stock boolean default true,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. JOBS (Labor Market)
create type job_status as enum ('open', 'closed', 'filled');

create table jobs (
  id uuid default uuid_generate_v4() primary key,
  farmer_id uuid references profiles(id) on delete cascade not null,
  title text not null, -- e.g., 'Cotton Picking', 'Plowing'
  description text,
  wage text, -- e.g., '500/day'
  workers_needed int default 1,
  location text,
  status job_status default 'open',
  contact_phone text, -- Phone number to call
  posted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES (Security)
alter table profiles enable row level security;
alter table shops enable row level security;
alter table products enable row level security;
alter table jobs enable row level security;

-- Public Read Access
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Shops are viewable by everyone." on shops for select using (true);
create policy "Products are viewable by everyone." on products for select using (true);
create policy "Jobs are viewable by everyone." on jobs for select using (true);

-- Insert Access (Simulated for now, would be stricter in prod)
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Shop Owners can insert shops." on shops for insert with check (auth.uid() = owner_id);
create policy "Shop Owners can insert products." on products for insert with check ( exists (select 1 from shops where id = shop_id and owner_id = auth.uid()) );
create policy "Farmers can insert jobs." on jobs for insert with check (auth.uid() = farmer_id);
