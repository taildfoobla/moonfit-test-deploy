const SPLIT_STR = 'revert'

export const getMainMessage = (message) => {
    let mainMessage = message
    if (message.includes(SPLIT_STR)) {
        mainMessage = message.split(SPLIT_STR)[1]
    } else if (message.includes('32603')) {
        mainMessage = "MetaMask [32603]: Insufficient balance, unable to send transaction"
    } else if (message.includes('gas required exceeds allowance')) {
        mainMessage = "Insufficient balance, unable to send transaction"
    }
    return mainMessage
}