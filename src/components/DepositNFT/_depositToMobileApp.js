import {depositNFTToApp, updateTransactionHash} from "../../utils/api";
import {sendTransaction} from "../../utils/blockchain";
import * as notification from "../../utils/notification";
import {getTransactionReceipt} from "../../services/smc-common";
const confirmTransaction = async (txHash, params, callback) => {
    const receipt = await getTransactionReceipt(txHash)
    console.log(receipt);
    if (receipt && receipt.status) {
        notification.close(txHash)
        notification.depositSuccess(txHash, params.type)

        callback({
            ...params,
            deposited: true,
        })

        return
    }

    setTimeout(() => {
        confirmTransaction(txHash, params, callback)
    }, 3000)
}
export const depositToMobileApp = async (provider, connector, params, callback) => {
    const response = await depositNFTToApp(params)

    const {data, success, message} = response
    const transactionData = data.transaction
    if (!success) {
        alert(message)

        return
    }

    transactionData.gas = String(transactionData.gas)

    const txHash = await sendTransaction(provider, connector, transactionData).catch(() => Promise.resolve(null))
    if (txHash) {
        updateTransactionHash({transaction_id: data.id, transaction_hash: txHash}).then()
        notification.destroy()
        notification.sentTransactionDepositSuccess(txHash)

        setTimeout(() => {
            confirmTransaction(txHash, {
                ...params,
                txHash,
            }, callback)
        }, 3000)


        return {
            transactionId: response.id,
            transactionData,
            txHash,
            deposited: false,
        }
    }
}