import { reactive, readonly } from 'vue';

type EventEmitter = (event: string, ...args: any[]) => void;
type EventRegistration = (event: string, callback: (...args: any[]) => void) => void;

interface EventBus {
    emit: EventEmitter;
    on: EventRegistration;
    off: EventRegistration;
}

const events = reactive<Record<string, Function[]>>({});

const eventBus: EventBus = {
    emit(event, args) {
        if (events[event]) {
            events[event].forEach((callback) => callback(args));
        }
    },
    on(event, callback) {
        if (!events[event]) {
            events[event] = [];
        }
        events[event].push(callback);
    },
    off(event, callback) {
        const index = events[event]?.indexOf(callback);
        if (index !== -1) {
            events[event].splice(index, 1);
        }
    },
};

export const Subscription = readonly({ on: eventBus.on, off: eventBus.off });
export const Eventing = readonly({ emit: eventBus.emit });