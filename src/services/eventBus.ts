import { ref } from "vue"

/**
 * eventBus - is used to transmite event from one component to other components
 */

const bus = ref(new Map())

export default function useEventBus() {
    /**
     * sets args as value and event as key in the bus map
     * @param event - string with event name
     * @param args - value which is transmited with the event
     */
    function emit(event: string, ...args: any) {
        bus.value.set(event, args)
    }
    return {
        emit,
        bus,
    }
}
