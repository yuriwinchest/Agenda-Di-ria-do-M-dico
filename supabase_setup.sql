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

-- Habilitar Realtime para convênios
ALTER PUBLICATION supabase_realtime ADD TABLE insurances;
