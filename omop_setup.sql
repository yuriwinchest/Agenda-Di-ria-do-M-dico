-- SCHEMA OMOP CDM v5.4 (Simplificado para Clínica Winchester)
-- Este schema é destinado a analytics e pesquisa multicêntrica.

CREATE SCHEMA IF NOT EXISTS omop;

-- 1. Tabelas de Saúde (Eventos Clínicos)
CREATE TABLE IF NOT EXISTS omop.person (
    person_id BIGINT PRIMARY KEY,
    gender_concept_id INTEGER NOT NULL,
    year_of_birth INTEGER NOT NULL,
    month_of_birth INTEGER,
    day_of_birth INTEGER,
    birth_datetime TIMESTAMP,
    race_concept_id INTEGER NOT NULL,
    ethnicity_concept_id INTEGER NOT NULL,
    location_id BIGINT,
    provider_id BIGINT,
    care_site_id BIGINT,
    person_source_value TEXT,
    gender_source_value TEXT,
    gender_source_concept_id INTEGER,
    race_source_value TEXT,
    race_source_concept_id INTEGER,
    ethnicity_source_value TEXT,
    ethnicity_source_concept_id INTEGER
);

CREATE TABLE IF NOT EXISTS omop.visit_occurrence (
    visit_occurrence_id BIGINT PRIMARY KEY,
    person_id BIGINT NOT NULL REFERENCES omop.person(person_id),
    visit_concept_id INTEGER NOT NULL,
    visit_start_date DATE NOT NULL,
    visit_start_datetime TIMESTAMP,
    visit_end_date DATE NOT NULL,
    visit_end_datetime TIMESTAMP,
    visit_type_concept_id INTEGER NOT NULL,
    provider_id BIGINT,
    care_site_id BIGINT,
    visit_source_value TEXT,
    visit_source_concept_id INTEGER,
    admitted_from_concept_id INTEGER,
    admitted_from_source_value TEXT,
    discharged_to_concept_id INTEGER,
    discharged_to_source_value TEXT,
    preceding_visit_occurrence_id BIGINT
);

CREATE TABLE IF NOT EXISTS omop.condition_occurrence (
    condition_occurrence_id BIGINT PRIMARY KEY,
    person_id BIGINT NOT NULL REFERENCES omop.person(person_id),
    condition_concept_id INTEGER NOT NULL,
    condition_start_date DATE NOT NULL,
    condition_start_datetime TIMESTAMP,
    condition_end_date DATE,
    condition_end_datetime TIMESTAMP,
    condition_type_concept_id INTEGER NOT NULL,
    stop_reason TEXT,
    provider_id BIGINT,
    visit_occurrence_id BIGINT REFERENCES omop.visit_occurrence(visit_occurrence_id),
    condition_source_value TEXT,
    condition_source_concept_id INTEGER,
    condition_status_source_value TEXT,
    condition_status_concept_id INTEGER
);

CREATE TABLE IF NOT EXISTS omop.procedure_occurrence (
    procedure_occurrence_id BIGINT PRIMARY KEY,
    person_id BIGINT NOT NULL REFERENCES omop.person(person_id),
    procedure_concept_id INTEGER NOT NULL,
    procedure_date DATE NOT NULL,
    procedure_datetime TIMESTAMP,
    procedure_type_concept_id INTEGER NOT NULL,
    modifier_concept_id INTEGER,
    quantity INTEGER,
    provider_id BIGINT,
    visit_occurrence_id BIGINT REFERENCES omop.visit_occurrence(visit_occurrence_id),
    procedure_source_value TEXT,
    procedure_source_concept_id INTEGER,
    modifier_source_value TEXT
);

-- 2. Tabela de Metadados de Vocabulário (Padrão OHDSI)
CREATE TABLE IF NOT EXISTS omop.concept (
    concept_id INTEGER PRIMARY KEY,
    concept_name TEXT NOT NULL,
    domain_id TEXT NOT NULL,
    vocabulary_id TEXT NOT NULL,
    concept_class_id TEXT NOT NULL,
    standard_concept TEXT,
    concept_code TEXT NOT NULL,
    valid_start_date DATE NOT NULL,
    valid_end_date DATE NOT NULL,
    invalid_reason TEXT
);

-- Notas: Em produção, o carregamento dos vocabulários (SNOMED, LOINC) 
-- ocuparia vários GBs. Aqui configuramos apenas a estrutura.
