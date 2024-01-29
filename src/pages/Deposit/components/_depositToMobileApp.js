// import {depositNFTToApp, updateTransactionHash} from "../../utils/api";
// import {sendTransaction} from "../../utils/blockchain";
import {depositNFTToApp, updateTransactionHash} from "../../../core/utils-app/api";
import {sendTransaction} from "../../../core/utils-app/blockchain";
export const depositToMobileApp = async (provider, connector, params, callback) => {
    const response = await depositNFTToApp(params)
    console.log("depositProvider",provider)
    console.log("depositConnector",connector)
    let {data, success, message} = response
    if (typeof data.success === "boolean" && !data.success) {
        success = false;
        message = data.message
    }

    const transactionData = data.transaction
    if (!success) {
        callback({
            success: false,
            message: String(message).includes('insufficient funds for transfer') ? 'Insufficient funds for transfer' : message,
        })

        return
    }

    // transactionData.gas = String(transactionData.gas)

    const txHash = await sendTransaction(provider, connector, transactionData).catch((e) => {
        success = false
        message = 'MetaMask Tx Signature: User denied transaction signature'
        Promise.resolve(null)
    })
    if (txHash) {
        updateTransactionHash([{transaction_id: data.id, transaction_hash: txHash}]).then()
    }

    callback({
        success,
        message,
        transactionId: response.id,
        transactionData,
        txHash,
    })
}
