
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_INTEGRACLINIC_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_INTEGRACLINIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSearch(term: string) {
    console.log(`Searching for: "${term}"`);
    const cleanCpf = term.replace(/\D/g, '');

    let query = supabase
        .from('patients')
        .select('id, name, cpf');

    if (cleanCpf && cleanCpf.length > 0) {
        query = query.or(`name.ilike.%${term}%,cpf.ilike.%${cleanCpf}%`);
    } else {
        query = query.ilike('name', `%${term}%`);
    }

    const { data, error } = await query.limit(10);

    if (error) {
        console.error('Search error:', error);
    } else {
        console.log('Results:', data);
    }
}

async function run() {
    await testSearch('dim');
    await testSearch('010');
    await testSearch('D');
}

run();
