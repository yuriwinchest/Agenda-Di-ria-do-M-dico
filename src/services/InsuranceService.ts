import { supabase } from '../lib/supabase';
import { eventBus, EVENTS } from '../utils/eventBus';

class InsuranceService {
    async getInsurances() {
        // In a real scenario, this would come from a table
        const { data, error } = await supabase.from('insurances').select('*');
        if (error) {
            // Fallback for demo or if table doesn't exist
            return [
                { id: '1', name: 'Unimed Central', operator_code: 'UNI-999', version: '3.05.00', plans: [], professionals: [] },
                { id: '2', name: 'Bradesco Saúde', operator_code: 'BRD-123', version: '3.04.01', plans: [], professionals: [] }
            ];
        }
        return data;
    }

    async saveInsurance(insurance: any) {
        const { data, error } = await supabase
            .from('insurances')
            .upsert([insurance])
            .select();

        if (error) throw error;

        eventBus.publish(EVENTS.INSURANCE_UPDATED, data[0]);
        return data[0];
    }
}

export const insuranceService = new InsuranceService();
