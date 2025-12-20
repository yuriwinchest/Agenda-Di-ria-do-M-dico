-- Tabelas para Prontuário Médico (Evolução, Prescrições, Exames)

-- 1. Evoluções Clínicas
CREATE TABLE IF NOT EXISTS public.medical_evolutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES public.appointments(id),
    patient_id UUID REFERENCES public.patients(id),
    doctor_id UUID REFERENCES public.doctors(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Prescrições (Receitas)
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES public.appointments(id),
    patient_id UUID REFERENCES public.patients(id),
    doctor_id UUID REFERENCES public.doctors(id),
    medications JSONB NOT NULL DEFAULT '[]', -- Lista de medicamentos, dosagem, etc
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Pedidos de Exame
CREATE TABLE IF NOT EXISTS public.exam_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES public.appointments(id),
    patient_id UUID REFERENCES public.patients(id),
    doctor_id UUID REFERENCES public.doctors(id),
    exams JSONB NOT NULL DEFAULT '[]', -- Lista de exames solicitados
    justification TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Habilitar Realtime para estas tabelas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'medical_evolutions'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.medical_evolutions;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'prescriptions'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.prescriptions;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'exam_requests'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.exam_requests;
    END IF;
END $$;
