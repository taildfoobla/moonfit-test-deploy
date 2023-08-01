import {depositNFTToApp, updateTransactionHash} from "../../utils/api";
import {sendTransaction} from "../../utils/blockchain";
export const depositToMobileApp = async (provider, connector, params, callback) => {
    const response = await depositNFTToApp(params)

    const {data, success, message} = response
    const transactionData = data.transaction
    if (!success) {
        callback({
            success: false,
            message,
        })

        return
    }

    transactionData.gas = String(transactionData.gas)

    const txHash = await sendTransaction(provider, connector, transactionData).catch(() => Promise.resolve(null))
    if (txHash) {
        updateTransactionHash({transaction_id: data.id, transaction_hash: txHash}).then()
    }

    callback({
        success: true,
        transactionId: response.id,
        transactionData,
        txHash,
    })
}