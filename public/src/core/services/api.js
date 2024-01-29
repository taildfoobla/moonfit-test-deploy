import axios from "axios"
import TokenService from "./token"
import { COMMON_CONFIGS } from "../utils/configs/common"
import { useAuth } from "../contexts/auth"
import { message } from "antd"
import { LOCALSTORAGE_KEY, getLocalStorage, removeLocalStorage } from "../utils/helpers/storage"
const { API_URL, API_URL_v1, API_APP_URI,API_URL_EVENT } = COMMON_CONFIGS

const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)


const axiosPublic = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

const axiosEvent = axios.create({
    baseURL: API_URL_EVENT,
    headers: {
        "Content-Type": "application/json",
    },
})

const axiosPublicV1 = axios.create({
    baseURL: API_URL_v1,
    headers: {
        "Content-Type": "application/json",
    },
})


const axiosProduction = axios.create({
   
    baseURL: 'https://raffle-game-api.moonfit.xyz',
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer` 
    },
})

axios.defaults.baseURL = API_URL
axios.defaults.validateStatus = (status) => {
    return true
}

axios.interceptors.request.use(
    (config) => {
        const token = TokenService.getLocalAccessToken()

        if (token) {
            config.headers["authorization"] = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    (res) => {
        // if (res.status === 401) {
        //     message.error({
        //         content: "Something wrong, please relogin",
        //         className: "message-error",
        //     })
        //     removeLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT)
        //     removeLocalStorage(LOCALSTORAGE_KEY.NETWORK)
        //     removeLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
        //     setTimeout(() => {
        //         window.location.reload()
        //     }, 3000)
        // }
        return res
    },
    async (err) => {
        try {
            // call api get new tokens
            const refreshToken = TokenService.getLocalRefreshToken()
        } catch (e) {
            console.log(e)
            return Promise.reject(e)
        }
    }
)

const axiosPrivate = axios

const ApiService = {
    makeRequest: axiosPublic,
    makeEventRequest:axiosEvent,
    makeAuthRequest: axiosPrivate,
    makeRequestV1: axiosPublicV1,
    makeProductionRequest: axiosProduction
}

export default ApiService
