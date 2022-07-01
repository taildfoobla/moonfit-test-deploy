const SPLIT_STR = 'revert'

export const getMainMessage = (message) => {
    let mainMessage = message
    if (message.includes(SPLIT_STR)) {
        mainMessage = message.split(SPLIT_STR)[1]
    }
    return mainMessage
}