import {createApiRequest} from "../utils/api"

export const getPrivateSaleInfo = () => {
    return createApiRequest({
        url: "/mfg-private-sale",
        method: "GET"
    })
}

export const getWalletInfo = (address) => {
    return createApiRequest({
        url: "/mfg-private-sale/wallet",
        method: "GET",
        params: {address}
    })
}

export const getWalletMerklePath = (address) => {
    return createApiRequest({
        url: "/merkle-path",
        method: "GET",
        params: {address}
    })
}

export const getMintPassInfo = (address) => {
    return createApiRequest({
        url: "/mint-pass",
        method: "GET",
    })
}

export const getMintPassWalletInfo = (address) => {
    return createApiRequest({
        url: "/mint-pass/wallet",
        method: "GET",
        params: {address}
    })
}
