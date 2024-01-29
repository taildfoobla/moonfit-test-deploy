import {COMMON_CONFIGS} from "../utils/configs/common"
import ApiService from "./api"
const {API_APP_URI} = COMMON_CONFIGS

export const getLuckyWheelInfo = async () => {
    const {data} = await ApiService.makeRequest.get(`missions/lucky-wheel-onchain`)
    return data
}

export const spintOnChainNoToken = async (req) => {
    const {data} = await ApiService.makeRequest.post(`missions/lucky-wheel-onchain/spin`, req)
    return data
}

export const updateTransactionNoToken = async (req) => {
    const {data} = await ApiService.makeRequest.post(`wallet/update-wallet-transaction-by-web-with-key`, req)
    return data
}

export const checkOnchain = async ([lucky_wheel_id]) => {
    const {data} = await ApiService.makeRequest.get(
        `missions/lucky-wheel-onchain/check-result-spin-onchain?lucky_wheel_id=${lucky_wheel_id}`
    )
    return data
}

export const spintOnChainHaveToken = async ([]) => {
    const {data} = await ApiService.makeAuthRequest.post(`missions/lucky-wheel-onchain/spin`)
    return data
}

export const updateTransactionHaveToken = async ([transaction_id,transaction_hash]) => {
    const req= {
        transaction_id:transaction_id,
        transaction_hash:transaction_hash
    }
    const {data} = await ApiService.makeAuthRequest.post(`wallet/update-wallet-transaction-by-web`, req)
    return data
}

export const getHisoryList = async (wallet_address) => {
    const {data} = await ApiService.makeRequest.get(
        `missions/onchain-histories/lucky_wheel?wallet_address=${wallet_address}`
    )
    return data
}

