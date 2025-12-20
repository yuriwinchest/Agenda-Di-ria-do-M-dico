type Handler = (data?: any) => void;

class EventBus {
    private events: { [key: string]: Handler[] } = {};

    subscribe(event: string, handler: Handler): () => void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(handler);

        // Return unsubscribe function
        return () => {
            this.events[event] = this.events[event].filter(h => h !== handler);
        };
    }

    publish(event: string, data?: any) {
        if (!this.events[event]) return;
        this.events[event].forEach(handler => handler(data));
    }
}

export const eventBus = new EventBus();

export const EVENTS = {
    PATIENT_CREATED: 'PATIENT_CREATED',
    APPOINTMENT_SCHEDULED: 'APPOINTMENT_SCHEDULED',
    PAYMENT_COMPLETED: 'PAYMENT_COMPLETED',
    INSURANCE_UPDATED: 'INSURANCE_UPDATED',
    VIEW_CHANGED: 'VIEW_CHANGED'
};
