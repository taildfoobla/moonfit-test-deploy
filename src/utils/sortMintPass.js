// eslint-disable-next-line import/no-anonymous-default-export
export default (a, b) => {
    if (a.isOutOfSlot && b.isOutOfSlot) {
        return 0
    }

    if (a.isOutOfSlot) {
        return 1
    }

    if (b.isOutOfSlot) {
        return -1
    }

    if (a.availableSlots === b.availableSlots) {
        return 0
    }

    return a.availableSlots - b.availableSlots
}
