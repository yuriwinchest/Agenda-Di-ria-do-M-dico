const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connectionString = process.env.integraclinic_POSTGRES_URL_NON_POOLING || process.env.VITE_SUPABASE_DB_URL || process.env.DATABASE_URL;

if (!connectionString) {
    console.error('Erro: VITE_SUPABASE_DB_URL ou DATABASE_URL não encontrada no .env');
    process.exit(1);
}

const sqlFile = process.argv[2];
if (!sqlFile) {
    console.error('Erro: Por favor, forneça o caminho do arquivo SQL.');
    process.exit(1);
}

const client = new Client({
    user: process.env.integraclinic_POSTGRES_USER,
    host: process.env.integraclinic_POSTGRES_HOST,
    database: process.env.integraclinic_POSTGRES_DATABASE,
    password: process.env.integraclinic_POSTGRES_PASSWORD,
    port: 5432,
    ssl: { rejectUnauthorized: false }
});

async function execute() {
    try {
        await client.connect();
        const sql = fs.readFileSync(path.resolve(sqlFile), 'utf8');
        console.log(`Executando ${sqlFile}...`);
        await client.query(sql);
        console.log('Sucesso!');
    } catch (err) {
        console.error('Erro ao executar SQL:', err);
    } finally {
        await client.end();
    }
}

execute();
