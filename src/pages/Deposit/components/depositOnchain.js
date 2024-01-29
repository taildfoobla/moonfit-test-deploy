// import {depositNFTToApp, updateTransactionHash} from "../../utils/api";
// import {sendTransaction} from "../../utils/blockchain";
import {depositNFTToApp, updateTransactionHash, checkTransactionHash} from "../../../core/utils-app/api"
import { updateTransactionHaveToken, updateTransactionNoToken } from "../../../core/services/lucky-wheel"
import {sendTransaction} from "../../../core/utils-app/blockchain"
import { getLocalStorage,LOCALSTORAGE_KEY } from "../../../core/utils/helpers/storage"
import CryptoJS from "crypto-js"
import { COMMON_CONFIGS } from "../../../core/utils/configs/common"

const {CYBER_ACCOUNT_KEY} = COMMON_CONFIGS

export const depositOnchain = async ([provider, connector, data, account]) => {
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)

    const transactionData = data.transaction_data
    const sendData = {
        ...transactionData.transaction,
        from: account,
    }
    try{
        const txHash = await sendTransaction(provider, connector, sendData)
        console.log("txHash", txHash)
        if (txHash) {
           console.log("beforeUpdate")
           if(accessToken!==null){
            updateTransactionHaveToken([ data.wallet_transaction_id,  txHash])
           }else{
            const value = {
                wallet_address: account,
                time: Date.now(),
            }
            const key = CryptoJS.AES.encrypt(JSON.stringify(value), CYBER_ACCOUNT_KEY).toString()
            updateTransactionNoToken({transaction_id: data.wallet_transaction_id, transaction_hash: txHash,key})
           }
           console.log("afterUpdate") 
           return true
        }else{
            return false
        }
    }catch(err){
        console.log("err",err)
        return false
    }
}

