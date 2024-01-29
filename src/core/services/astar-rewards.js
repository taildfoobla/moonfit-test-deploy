import {COMMON_CONFIGS} from "../utils/configs/common"
import ApiService from "./api"
const {API_APP_URI} = COMMON_CONFIGS

export const getMoonFitTotalStakeAPI = async () => {
    const {data} = await ApiService.makeRequest.post("/rewards/staking/get-staking-info")
    return data
}

export const getStakeInfoAPI = async (req) => {
    const {data} = await ApiService.makeRequest.post("/rewards/staking/get-staking-info", req)
    return data
}

export const claimStakingAPI = async (req) => {
    const {data} = await ApiService.makeRequest.post("/rewards/staking/claim-staking", req)
    return data
}

export const updateTransactionAPI = async (req) => {
    const {data} = await ApiService.makeRequest.post("/wallet/update-wallet-transaction-without-token", req)
    return data
}

