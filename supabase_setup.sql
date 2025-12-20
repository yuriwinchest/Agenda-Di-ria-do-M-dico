-- Tabela de Convênios
CREATE TABLE IF NOT EXISTS insurances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    registration_number TEXT,
    grace_period INTEGER DEFAULT 30,
    billing_executor TEXT CHECK (billing_executor IN ('clinic', 'professional')),
    operator_code TEXT,
    version TEXT DEFAULT '3.05.00',
    next_batch TEXT DEFAULT '1',
    next_guide TEXT DEFAULT '1',
    sadt_team BOOLEAN DEFAULT FALSE,
    plans JSONB DEFAULT '[]',
    professionals UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Médicos (Caso não exista)
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    crm TEXT,
    specialty TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserindo Médicos do Mock para o Banco Real
INSERT INTO doctors (id, name, specialty, avatar_url)
VALUES 
    (uuid_generate_v4(), 'Dr. Lucas Silva', 'Cardiologia', 'https://randomuser.me/api/portraits/men/32.jpg'),
    (uuid_generate_v4(), 'Dra. Ana Beatris', 'Dermatologia', 'https://randomuser.me/api/portraits/women/44.jpg'),
    (uuid_generate_v4(), 'Dr. Roberto Santos', 'Ortopedia', 'https://randomuser.me/api/portraits/men/45.jpg')
ON CONFLICT (id) DO NOTHING;

-- 1. Tabelas de Convênios e TUSS
CREATE TABLE IF NOT EXISTS public.tuss_procedures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL, -- Código TUSS
    description TEXT NOT NULL,
    category TEXT, -- Consulta, Exame, Cirurgia
    base_value DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.tiss_guides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id),
    appointment_id UUID,
    insurance_id UUID REFERENCES public.insurances(id),
    guide_number TEXT UNIQUE,
    auth_number TEXT,
    status TEXT DEFAULT 'rascunho',
    total_value DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    xml_data JSONB
);

-- 2. Infraestrutura de Eventos (EDA / Auditoria)
CREATE TABLE IF NOT EXISTS public.system_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL,
    aggregate_id UUID,
    user_id UUID,
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Habilitar Realtime com Blocos DO (Seguro contar erros de duplicidade)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'insurances'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.insurances;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'tiss_guides'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.tiss_guides;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'system_events'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.system_events;
    END IF;
END $$;

-- Dados Iniciais TUSS (Exemplos)
INSERT INTO public.tuss_procedures (code, description, category, base_value)
VALUES 
('10101012', 'CONSULTA EM CONSULTORIO (NO HORARIO NORMAL OU PREESTABELECIDO)', 'CONSULTA', 150.00),
('40301017', 'HEMOGRAMA COM CONTAGEM DE PLAQUETAS', 'EXAME', 45.00),
('40101010', 'ELETROCARDIOGRAMA', 'EXAME', 80.00)
ON CONFLICT (code) DO NOTHING;
