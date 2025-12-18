
import pg from 'pg';
import dotenv from 'dotenv';
const { Client } = pg;

dotenv.config();

const connectionString = process.env.integraclinic_POSTGRES_URL;

async function migrate() {
    const client = new Client({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('Connected to Postgres');

        const sql = `
            ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS billing_type text DEFAULT 'Particular';
            ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS preferred_payment_method text;
            ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS insurance_provider text DEFAULT 'Particular';
            ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS insurance_card_number text;
            ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS observations text;
            ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS billing_type text;
            ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS payment_method text;
            ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS authorization_number text;
            ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS token_code text;
            ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS billing_status text DEFAULT 'pending';
            ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS tuss_code text;
        `;

        await client.query(sql);
        console.log('Migration successful: All columns added.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

migrate();
