const SPLIT_STR = 'revert'

export const getMainMessage = (message) => {
    let mainMessage = message.toString()

    if (message.includes(SPLIT_STR)) {
        mainMessage = message.split(SPLIT_STR)[1]
        if (message.includes("Internal JSON-RPC error")) {
            // console.log(mainMessage.split('\",'))
            mainMessage = mainMessage.split('",')[0]
        }
    } else if (message.includes('32603')) {
        mainMessage = "MetaMask [32603]: Insufficient balance, unable to send transaction"
    } else if (message.includes('gas required exceeds allowance')) {
        mainMessage = "Insufficient balance, unable to send transaction"
    }

    return mainMessage || message
}
