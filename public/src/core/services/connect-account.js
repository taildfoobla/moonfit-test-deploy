import {COMMON_CONFIGS} from "../utils/configs/common"
import {LOCALSTORAGE_KEY, getLocalStorage} from "../utils/helpers/storage"
import ApiService from "./api"
import {firebaseConfig} from "../utils/helpers/firebase"
const {API_APP_URI} = COMMON_CONFIGS

export const connectWalletToAccountAPI = async () => {
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    const walletSignature = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))
    const signature =walletSignature?.signature
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
        },
    }
    const {data} = await ApiService.makeRequest.post("/wallet/connect-wallet",signature ,config)
    return data
}


