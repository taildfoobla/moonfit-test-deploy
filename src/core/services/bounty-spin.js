import {COMMON_CONFIGS} from "../utils/configs/common"
import ApiService from "./api"
const {API_APP_URI} = COMMON_CONFIGS
import { getLocalStorage,LOCALSTORAGE_KEY } from "../utils/helpers/storage"

export const getWheelInfo = async ([chainId]) => {
    console.log("inAPI")
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    const walletAddress=JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))?.account
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
        },
    }
//    if(walletAddress&&chainId){
    const {data} = await ApiService.makeRequest.get(`missions/lucky-wheel-onchain?chain_id=${chainId}&wallet_address=${walletAddress}`, config)
    return data
//    }
    
}

export const spinOnChain = async ([value]) => {
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
        },
    }
    const body = value
    const {data} = await ApiService.makeRequest.post(`missions/lucky-wheel-onchain/spin`, body, config)
    return data
}

export const updateTransactionHash = async ([transaction_id, transaction_hash]) => {
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
        },
    }
    const body = {
        transaction_id: transaction_id,
        transaction_hash: transaction_hash,
    }
    const {data} = await ApiService.makeRequest.post(`wallet/update-wallet-transaction-by-web`, body, config)
    return data
}

export const checkOnchain = async ([chainId]) => {
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    if(accessToken!==null){
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
            },
        }
        const {data} = await ApiService.makeRequest.get(
            `missions/lucky-wheel-onchain/check-result-spin-onchain?lucky_wheel_id=${chainId}`,
            config
        )
        return data
    }
    
}

export const getHisoryList = async ([wallet_address,lastId,limit]) => {
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
        },
    }
    const {data} = await ApiService.makeRequest.get(
        `missions/onchain-histories/lucky_wheel?wallet_address=${wallet_address}&last_id=${lastId}&limit=${limit}`,
        config
    )
    return data
}

