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