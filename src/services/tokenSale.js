import {createApiRequest} from "../utils/api"

export const getPrivateSaleInfo = () => {
    return createApiRequest({
        url: "/token-sale/mfg-private-sale",
        method: "GET"
    })
}

export const getWalletInfo = (address) => {
    return createApiRequest({
        url: "/token-sale/mfg-private-sale/wallet",
        method: "GET",
        params: {address}
    })
}

export const getWalletMerklePath = (address) => {
    return createApiRequest({
        url: "/token-sale/merkle-path",
        method: "GET",
        params: {address}
    })
}

export const getMintPassInfo = (address) => {
    return createApiRequest({
        url: "/token-sale/mint-pass",
        method: "GET",
    })
}

export const getMintPassWalletInfo = (address) => {
    return createApiRequest({
        url: "/token-sale/mint-pass/wallet",
        method: "GET",
        params: {address}
    })
}
