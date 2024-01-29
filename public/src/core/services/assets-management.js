import {COMMON_CONFIGS} from "../utils/configs/common"
import {LOCALSTORAGE_KEY, getLocalStorage} from "../utils/helpers/storage"
import ApiService from "./api"
import {firebaseConfig} from "../utils/helpers/firebase"
const {API_APP_URI} = COMMON_CONFIGS

export const getAssetsDataAPI = async () => {
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
        },
    }
    const {data} = await ApiService.makeRequest.get("/wallet/asset-in-app-by-web", config)
    return data
}

export const getAccessTokenAPI=async()=>{
    const refreshToken=getLocalStorage(LOCALSTORAGE_KEY.REFRESH_TOKEN)
    // const config = {
    //     headers: {
    //         "Content-Type": "application/x-www-form-urlencoded",
    //     },
    // }
    const body={
        grant_type: "refresh_token",
        refresh_token:refreshToken
    }
    const {data} = await ApiService.makeRequest.post(`https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`,body)
    return data
}

