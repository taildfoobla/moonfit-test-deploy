import {COMMON_CONFIGS} from "../utils/configs/common"
import {LOCALSTORAGE_KEY, getLocalStorage} from "../utils/helpers/storage"
import ApiService from "./api"
import {firebaseConfig} from "../utils/helpers/firebase"
const {API_APP_URI} = COMMON_CONFIGS

export const check2faAPI = async () => {
    console.log("here")
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
        },
    }
    const {data} = await ApiService.makeRequest.get("/users/2fa/status", config)
    return data
}

export const generate2faAPI = async () => {
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
        },
    }
    const {data} = await ApiService.makeRequest.post("/users//2fa/generate", {}, config)
    return data
}

export const create2faAPI = async ([code]) => {
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    const body = {
        digit_code: code,
    }
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
        },
    }
    const {data} = await ApiService.makeRequest.post("/users/2fa/confirm", body, config)
    return data
}

export const change2faAPI = async ([code]) => {
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    const body = {
        digit_code: code,
    }
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
        },
    }
    const {data} = await ApiService.makeRequest.post("/users/2fa/change", body, config)
    return data
}



