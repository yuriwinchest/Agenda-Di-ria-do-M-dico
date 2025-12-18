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
  notes text,
  gender text, -- Added for full profile
  health_plan_id uuid, -- Reference to health_plans table
  insurance_card_number text
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
  notes text,
  authorization_number text, -- Guia de autorização
  token_code text -- Token de validação do convênio
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
  category text, -- e.g. 'consultation', 'exam', 'products'
  tuss_code text, -- Código TUSS para faturamento
  billing_status text default 'pending' check (status in ('pending', 'paid', 'refunded', 'cancelled', 'processing_faturamento', 'glosado'))
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

-- 6. Services / Procedures (Tabela de Serviços)
create table if not exists public.services (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null, -- e.g. "Consulta Cardiológica"
  description text,
  price numeric(10,2) not null,
  duration_minutes integer default 30,
  specialty text -- Filters services by doctor specialty
);

-- 7. Medical Records (Prontuário Eletrônico)
create table if not exists public.medical_records (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  patient_id uuid references public.patients(id) on delete cascade,
  doctor_id uuid references public.doctors(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null,
  date timestamp with time zone default now(),
  type text default 'evolution', -- anamnesis, evolution, prescription, exam_result
  content text not null, -- Rich text or JSON content
  attachments text[], -- Array of URLs
  diagnosis_cid text -- CID-10 code if applicable
);

-- 8. Clinic Settings (Configurações)
create table if not exists public.clinic_settings (
  id uuid default uuid_generate_v4() primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  clinic_name text default 'Minha Clínica',
  logo_url text,
  primary_color text default '#2563eb',
  address text,
  contact_email text,
  contact_phone text,
  business_hours jsonb -- Structured opening hours
);

-- 11. Health Plans (Convênios)
create table if not exists public.health_plans (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null, -- e.g. SulAmérica, Unimed, Bradesco
  ans_code text, -- Registro ANS da operadora
  portal_url text, -- Link para portal de faturamento/elegibilidade
  tiss_version text default '4.01.01',
  active boolean default true
);

-- Add Foreign Key to Patients (if not already handled)
-- alter table public.patients add constraint fk_patients_health_plan foreign key (health_plan_id) references public.health_plans(id);

-- 12. Procedures Table (Tabela de Procedimentos/TUSS)
create table if not exists public.procedures (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  code text unique not null, -- Código TUSS
  name text not null,
  description text,
  category text, -- Consulta, Exame, Cirurgia, etc.
  base_price numeric(10,2) not null,
  active boolean default true
);

-- Inserindo alguns procedimentos reais (Exemplos TUSS)
insert into public.procedures (code, name, category, base_price) values
('10101012', 'CONSULTA EM CONSULTÓRIO (NO HORÁRIO NORMAL OU PREESTABELECIDO)', 'Consultas', 150.00),
('10101039', 'CONSULTA EM DOMICÍLIO', 'Consultas', 250.00),
('40101010', 'ECG CONVENCIONAL DE ATÉ 12 DERIVAÇÕES', 'Exames', 45.00),
('40301000', 'HEMOGRAMA COMPLETO', 'Exames', 25.00),
('40302000', 'GLICOSE', 'Exames', 15.00),
('40801010', 'RADIOGRAFIA DE TÓRAX - 1 POSIÇÃO', 'Exames', 60.00)
on conflict (code) do nothing;

-- 9. Profiles (Link Auth Users to Staff Roles)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text default 'receptionist' check (role in ('admin', 'doctor', 'receptionist', 'nurse')),
  doctor_id uuid references public.doctors(id) on delete set null, -- If user is a doctor, link to doctor profile
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 10. Goals/Targets (Metas para Relatórios)
create table if not exists public.specialty_targets (
  id uuid default uuid_generate_v4() primary key,
  specialty text not null,
  month date not null, -- First day of the month
  revenue_target numeric(10,2),
  appointments_target integer
);

-- Row Level Security (RLS) - Basic Setup
alter table public.patients enable row level security;
alter table public.doctors enable row level security;
alter table public.appointments enable row level security;
alter table public.transactions enable row level security;
alter table public.invoice_items enable row level security;
alter table public.services enable row level security;
alter table public.medical_records enable row level security;
alter table public.clinic_settings enable row level security;
alter table public.profiles enable row level security;
alter table public.specialty_targets enable row level security;
alter table public.health_plans enable row level security;
alter table public.procedures enable row level security;

-- Policies (Allow all for development)
-- Policies (Allow all for development)
DROP POLICY IF EXISTS "Enable all access for anon" on public.patients;
create policy "Enable all access for anon" on public.patients for all using (true);

DROP POLICY IF EXISTS "Enable all access for anon" on public.doctors;
create policy "Enable all access for anon" on public.doctors for all using (true);

DROP POLICY IF EXISTS "Enable all access for anon" on public.appointments;
create policy "Enable all access for anon" on public.appointments for all using (true);

DROP POLICY IF EXISTS "Enable all access for anon" on public.transactions;
create policy "Enable all access for anon" on public.transactions for all using (true);

DROP POLICY IF EXISTS "Enable all access for anon" on public.invoice_items;
create policy "Enable all access for anon" on public.invoice_items for all using (true);

DROP POLICY IF EXISTS "Enable all access for anon" on public.services;
create policy "Enable all access for anon" on public.services for all using (true);

DROP POLICY IF EXISTS "Enable all access for anon" on public.medical_records;
create policy "Enable all access for anon" on public.medical_records for all using (true);

DROP POLICY IF EXISTS "Enable all access for anon" on public.clinic_settings;
create policy "Enable all access for anon" on public.clinic_settings for all using (true);

DROP POLICY IF EXISTS "Enable all access for anon" on public.profiles;
create policy "Enable all access for anon" on public.profiles for all using (true);

DROP POLICY IF EXISTS "Enable all access for anon" on public.specialty_targets;
create policy "Enable all access for anon" on public.specialty_targets for all using (true);

DROP POLICY IF EXISTS "Enable all access for anon" on public.health_plans;
create policy "Enable all access for anon" on public.health_plans for all using (true);

DROP POLICY IF EXISTS "Enable all access for anon" on public.procedures;
create policy "Enable all access for anon" on public.procedures for all using (true);
