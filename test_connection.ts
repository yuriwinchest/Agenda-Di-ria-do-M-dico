import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_INTEGRACLINIC_SUPABASE_URL;
const supabaseKey = process.env.integraclinic_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Service Role Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    const { data, error } = await supabase
        .from('patients')
        .select('id')
        .limit(1);

    if (error) {
        console.error('Connection failed:', error.message);
    } else {
        console.log('Connection successful! Found patients:', data.length);
    }
}

testConnection();
