// import {depositNFTToApp, updateTransactionHash} from "../../utils/api";
// import {sendTransaction} from "../../utils/blockchain";
import { updateTransactionNoToken,updateTransactionHaveToken } from "../../services/lucky-wheel"
import {sendTransaction} from "../../../core/utils-app/blockchain"
import { updateTransactionHash } from "../../services/bounty-spin"
export const depositOnchainWheelNoToken = async (provider, connector, data, account,key) => {
   
    const transactionData = data.transaction_data
    const sendData = {
        ...transactionData.transaction,
        from: account,
    }
    try{
        const txHash = await sendTransaction(provider, connector, sendData)
        if (txHash) {
            updateTransactionNoToken({transaction_id: data.wallet_transaction_id, transaction_hash: txHash,key})
            return true
        }else{
            return false
        }
    }catch(err){
        console.log("err",err)
        return false
    }
   
}

export const depositOnchainWheelHaveToken = async ([provider, connector, data, account]) => {

    const transactionData = data.transaction_data
    const sendData = {
        ...transactionData.transaction,
        from: account,
    }
    try{
        const txHash = await sendTransaction(provider, connector, sendData)
        if (txHash) {
           
            updateTransactionHaveToken([ data.wallet_transaction_id,  txHash])
            return true
        }else{
            
            return false
        }
    }catch(err){
        console.log("err",err)
        return false
    }
    
}

export const depositOnchainWheel = async ([provider, connector, data, account]) => {

    const transactionData = data.transaction_data
    const sendData = {
        ...transactionData.transaction,
        from: account,
    }
    try{
        const txHash = await sendTransaction(provider, connector, sendData)
        if (txHash) {
           
           const res = await updateTransactionHash([ data.wallet_transaction_id,  txHash])
            return res?.meta?.lucky_wheel_id
        }else{
            
            return false
        }
    }catch(err){
        console.log("err",err)
        return false
    }
    
}