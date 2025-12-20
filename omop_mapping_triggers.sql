-- DATA MAPPING: system_events -> omop schema
-- Este script cria a lógica de transformação automática para garantir que dados clínicos
-- persistidos via EDA sejam refletidos no modelo analítico OMOP.

CREATE OR REPLACE FUNCTION omop.map_eda_to_omop() 
RETURNS TRIGGER AS $$
BEGIN
    -- Mapeamento de PATIENT_CREATED para omop.person
    IF (NEW.event_type = 'PATIENT_CREATED') THEN
        INSERT INTO omop.person (
            person_id,
            gender_concept_id,
            year_of_birth,
            race_concept_id,
            ethnicity_concept_id,
            person_source_value
        ) VALUES (
            -- Usamos o hash do UUID como ID numérico para o OMOP BIGINT (simplificado)
            ('x' || substr(md5(NEW.aggregate_id::text), 1, 8))::bit(32)::int,
            8532, -- Concept ID Genérico para "Female" ou "Male" (exemplo)
            2000, -- Placeholder: extrair do payload em sistema real
            0,
            0,
            NEW.payload->>'cpf'
        ) ON CONFLICT (person_id) DO NOTHING;
    END IF;

    -- Mapeamento de GUIDE_OPENED para omop.visit_occurrence
    IF (NEW.event_type = 'GUIDE_OPENED') THEN
        INSERT INTO omop.visit_occurrence (
            visit_occurrence_id,
            person_id,
            visit_concept_id,
            visit_start_date,
            visit_end_date,
            visit_type_concept_id,
            visit_source_value
        ) VALUES (
            ('x' || substr(md5(NEW.aggregate_id::text), 1, 8))::bit(32)::int,
            ('x' || substr(md5((NEW.payload->>'patient_id')::text), 1, 8))::bit(32)::int,
            9202, -- Outpatient Visit
            CURRENT_DATE,
            CURRENT_DATE,
            44818518, -- Clinical Study Visit (exemplo)
            NEW.payload->>'guide_number'
        ) ON CONFLICT (visit_occurrence_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_eda_to_omop ON public.system_events;
CREATE TRIGGER trg_eda_to_omop
AFTER INSERT ON public.system_events
FOR EACH ROW EXECUTE FUNCTION omop.map_eda_to_omop();
