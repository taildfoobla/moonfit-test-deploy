import {COMMON_CONFIGS} from "../utils/configs/common"
import {LOCALSTORAGE_KEY, getLocalStorage} from "../utils/helpers/storage"
import ApiService from "./api"
import {firebaseConfig} from "../utils/helpers/firebase"
const {API_APP_URI} = COMMON_CONFIGS

export const withdrawAPI = async ([value]) => {
   
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    const body = value
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
        },
    }
    const {data} = await ApiService.makeRequest.post("/wallet/withdrawal", body, config)
    console.log("data",data)
    return data
}

export const getFeeHealthAPI = async ([value]) => {
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    const body = value
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
        },
    }
    const {data} = await ApiService.makeRequest.post("/beasts/regain-fee-by-web", body, config)
    console.log("data",data)
    return data
}



export const regenHealthAPI = async ([value]) => {
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    const body = value
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
        },
    }
    const {data} = await ApiService.makeRequest.post("/beasts/payment-regained-health-by-web", body, config)
    console.log("data",data)
    return data
}


export const getFeeSpeedUpUpgradeAPI = async ([value]) => {
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    const body = value
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
        },
    }
    const {data} = await ApiService.makeRequest.post("/beasts/speed-up-level-upgrade-fee-by-web", body, config)
    console.log("data",data)
    return data
}


export const speedUpUpgradeAPI = async ([value]) => {
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    const body = value
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
        },
    }
    const {data} = await ApiService.makeRequest.post("/beasts/speed-up-level-upgrade-by-web", body, config)
    console.log("data",data)
    return data
}


export const unWearAllItemAPI = async ([value]) => {
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    const body = value
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
        },
    }
    const {data} = await ApiService.makeRequest.post("/beasts/un-wear-all-item", body, config)
    console.log("data",data)
    return data
}



export const leaveClanAPI = async ([value]) => {
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    const body = value
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
        },
    }
    const {data} = await ApiService.makeRequest.post("/clan/leave-clan", body, config)
    console.log("data",data)
    return data
}

export const cancelSellingAPI = async ([value]) => {
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    const body = value
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
        },
    }
    const {data} = await ApiService.makeRequest.post("/marketplace/cancel-selling", body, config)
    console.log("data",data)
    return data
}