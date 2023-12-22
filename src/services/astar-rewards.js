import {createApiRequest} from "../utils/api"

export const getMoonFitTotalStakeAPI = () => {
    return createApiRequest({
        url: "/rewards/staking/get-staking-info",
        method: "POST"
    })
}

export const getStakeInfoAPI=(data)=>{
    return createApiRequest({
        url: "/rewards/staking/get-staking-info",
        method: "POST",
        data
    })
}

export const claimStakingAPI=(data)=>{
    return createApiRequest({
        url: "/rewards/staking/claim-staking",
        method: "POST",
        data
    })
}

export const updateTransactionAPI=(data)=>{
    return createApiRequest({
        url: "/wallet/update-wallet-transaction-without-token",
        method: "POST",
        data
    })
}

