-- Enable UUID extension for unique identifiers
create extension if not exists "uuid-ossp";

-- 1. Patients Table
create table if not exists public.patients (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  cpf text unique,
  phone text,
  email text,
  birth_date date,
  insurance_provider text default 'Particular', -- e.g. Unimed, SulAmérica
  insurance_number text,
  address text,
  notes text
);

-- 2. Doctors Table
create table if not exists public.doctors (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  specialty text not null,
  crm text unique,
  email text,
  phone text,
  avatar_url text, -- URL for profile picture
  color text -- Color for calendar usage
);

-- 3. Appointments (Agenda)
create table if not exists public.appointments (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  patient_id uuid references public.patients(id) on delete set null,
  doctor_id uuid references public.doctors(id) on delete set null,
  appointment_date date not null,
  start_time time not null,
  end_time time,
  status text default 'scheduled' check (status in ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  type text default 'consulta', -- consulta, exame, retorno
  notes text
);

-- 4. Financial Transactions (Caixa)
create table if not exists public.transactions (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  appointment_id uuid references public.appointments(id) on delete set null,
  patient_id uuid references public.patients(id) on delete set null,
  description text not null, -- Main description (e.g. "Consulta Dr. Mendes")
  amount numeric(10,2) not null,
  status text default 'pending' check (status in ('pending', 'paid', 'refunded', 'cancelled')),
  payment_method text check (payment_method in ('credit', 'debit', 'pix', 'money')), -- matches frontend IDs
  payment_date timestamp with time zone,
  category text -- e.g. 'consultation', 'exam', 'products'
);

-- 5. Invoice Items (Detailing services within a transaction)
create table if not exists public.invoice_items (
  id uuid default uuid_generate_v4() primary key,
  transaction_id uuid references public.transactions(id) on delete cascade,
  description text not null,
  quantity integer default 1,
  unit_price numeric(10,2) not null,
  total_price numeric(10,2) generated always as (quantity * unit_price) stored
);

-- Row Level Security (RLS) - Basic Setup (Open for now, recommend locking down later)
alter table public.patients enable row level security;
alter table public.doctors enable row level security;
alter table public.appointments enable row level security;
alter table public.transactions enable row level security;
alter table public.invoice_items enable row level security;

-- Policies (Allow all for development - BE CAREFUL IN PRODUCTION)
create policy "Enable all access for anon" on public.patients for all using (true);
create policy "Enable all access for anon" on public.doctors for all using (true);
create policy "Enable all access for anon" on public.appointments for all using (true);
create policy "Enable all access for anon" on public.transactions for all using (true);
create policy "Enable all access for anon" on public.invoice_items for all using (true);
