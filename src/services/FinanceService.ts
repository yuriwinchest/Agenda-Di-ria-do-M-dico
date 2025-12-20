import { supabase } from '../lib/supabase';
import { eventBus, EVENTS } from '../utils/eventBus';

export interface TransactionData {
    patient_id: string;
    description: string;
    amount: number;
    billing_type: 'Particular' | 'Convênio';
    payment_method?: string;
    status: 'pending' | 'paid' | 'refund';
}

class FinanceService {
    async getTransactions(status: string) {
        const { data, error } = await supabase
            .from('transactions')
            .select(`
                id,
                amount,
                status,
                billing_status,
                description,
                created_at,
                patient_id,
                patients (
                    name,
                    insurance_provider,
                    insurance_card_number,
                    billing_type,
                    cpf,
                    phone,
                    email
                )
            `)
            .eq('status', status === 'refund' ? 'refunded' : status);

        if (error) throw error;
        return data;
    }

    async processPayment(transactionId: string, paymentMethod: string) {
        const { data, error } = await supabase
            .from('transactions')
            .update({
                status: 'paid',
                billing_status: 'authorized',
                payment_method: paymentMethod,
                payment_date: new Date().toISOString()
            })
            .eq('id', transactionId);

        if (error) throw error;

        eventBus.publish(EVENTS.PAYMENT_COMPLETED, { transactionId });
        return data;
    }

    async denyAuthorization(transactionId: string) {
        const { error } = await supabase
            .from('transactions')
            .update({
                billing_status: 'denied',
                status: 'paid'
            })
            .eq('id', transactionId);

        if (error) throw error;
        eventBus.publish(EVENTS.INSURANCE_UPDATED, { transactionId, status: 'denied' });
    }

    async createTransaction(data: TransactionData) {
        const { error } = await supabase
            .from('transactions')
            .insert([data]);

        if (error) throw error;
    }
}

export const financeService = new FinanceService();
