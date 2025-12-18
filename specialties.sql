-- Comprehensive list of Medical Specialties (CFM/AMB)
CREATE TABLE IF NOT EXISTS public.specialties (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  description text,
  active boolean DEFAULT true
);

-- Reset specialties if needed (optional)
-- TRUNCATE public.specialties CASCADE;

INSERT INTO public.specialties (name) VALUES
('Acupuntura'),
('Alergia e Imunologia'),
('Anestesiologia'),
('Angiologia'),
('Cardiologia'),
('Cirurgia Cardiovascular'),
('Cirurgia da Mão'),
('Cirurgia de Cabeça e Pescoço'),
('Cirurgia do Aparelho Digestivo'),
('Cirurgia Geral'),
('Cirurgia Oncológica'),
('Cirurgia Pediátrica'),
('Cirurgia Plástica'),
('Cirurgia Torácica'),
('Cirurgia Vascular'),
('Clínica Médica'),
('Coloproctologia'),
('Dermatologia'),
('Endocrinologia e Metabologia'),
('Endoscopia'),
('Gastroenterologia'),
('Genética Médica'),
('Geriatria'),
('Ginecologia e Obstetrícia'),
('Hematologia e Hemoterapia'),
('Homeopatia'),
('Infectologia'),
('Mastologia'),
('Medicina de Emergência'),
('Medicina de Família e Comunidade'),
('Medicina do Trabalho'),
('Medicina de Tráfego'),
('Medicina Esportiva'),
('Medicina Física e Reabilitação'),
('Medicina Intensiva'),
('Medicina Legal e Perícia Médica'),
('Medicina Nuclear'),
('Medicina Preventiva e Social'),
('Nefrologia'),
('Neurocirurgia'),
('Neurologia'),
('Nutrologia'),
('Oftalmologia'),
('Oncologia Clínica'),
('Ortopedia e Traumatologia'),
('Otorrinolaringologia'),
('Patologia'),
('Patologia Clínica / Medicina Laboratorial'),
('Pediatria'),
('Pneumologia'),
('Psiquiatria'),
('Radiologia e Diagnóstico por Imagem'),
('Radioterapia'),
('Reumatologia'),
('Urologia')
ON CONFLICT (name) DO NOTHING;

-- Policies
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for anon" on public.specialties;
CREATE POLICY "Enable all access for anon" on public.specialties for all using (true);
