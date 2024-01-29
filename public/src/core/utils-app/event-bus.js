const EventBus = {

    $on (eventType, callback) {
        document.addEventListener(eventType, (ev) => callback(ev.detail))
    },

    $dispatch (eventType, data) {
        const event = new CustomEvent(eventType, { detail: data })
        document.dispatchEvent(event)
    },

    $remove (eventType, callback) {
        document.removeEventListener(eventType, callback)
    }
}

window.EventBus = EventBus

export default EventBus
