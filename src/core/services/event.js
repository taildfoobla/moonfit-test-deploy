import {COMMON_CONFIGS} from "../utils/configs/common"
import CryptoJS from "crypto-js"
import {LOCALSTORAGE_KEY, getLocalStorage} from "../utils/helpers/storage"
import ApiService from "./api"
const {API_APP_URI, CYBER_ACCOUNT_KEY} = COMMON_CONFIGS

const _globals = {}

const getEventById = (id) => {
    const expiredTime = 10000
    if (!_globals[id] || _globals[id].time + expiredTime < Date.now()) {
        _globals[id] = {
            time: Date.now(),
            request: ApiService.makeAuthRequest.get(`/manager-event/find-event/${id}`),
        }
    }

    return _globals[id].request
}

const claimMerchandise = async (req) => {
    const {data} = await ApiService.makeAuthRequest.post(`manager-event/claim-merchandise`, req)
    return data
}

const claimRaffle = async (req) => {
    const {data} = await ApiService.makeAuthRequest.post(`manager-event/weekly-raffle/claim-weekly-raffle`, req)
    return data
}

const claimMintPass = async (req) => {
    const {data} = await ApiService.makeAuthRequest.post(``, req)
    return data
}

const checkHoldNft = async (req) => {
    const {data} = await ApiService.makeAuthRequest.post(`manager-event/weekly-raffle/check-hold-nft`, req)
    return data
}

const connectDiscord = (tokenDiscord, eventId) => {
    return ApiService.makeAuthRequest.post(
        `manager-event/weekly-raffle/connect-discord/?token_discord=${tokenDiscord}&event_id=${eventId}`
    )
}

const checkDiscord = async (req) => {
    const {data} = await ApiService.makeAuthRequest.post(`manager-event/weekly-raffle/check-discord`, req)
    return data
}

const connectTwitter = async (codeTwitter, eventId) => {
    return await ApiService.makeAuthRequest.post(
        `manager-event/weekly-raffle/connect-twitter?code_twitter=${codeTwitter}&event_id=${eventId}`
    )
}

const checkTwitter = async (req) => {
    const {data} = await ApiService.makeAuthRequest.post(`manager-event/weekly-raffle/check-twitter`, req)
    return data
}

const getUserInfoByEvent = (id) => {
    return ApiService.makeAuthRequest.get(`manager-event/weekly-raffle/get-user-info/${id}`)
}

const signMessageViaSubWallet = (data) => {
    return ApiService.makeAuthRequest.post(`manager-event/weekly-raffle/via-subwallet`, data)
}

const dailyCheckin = async (req) => {
    const {data} = await ApiService.makeAuthRequest.post(`manager-event/weekly-raffle/daily_checkin`, req)
    return data
}

const threeCheckin = async (req) => {
    const {data} = await ApiService.makeAuthRequest.post(`manager-event/weekly-raffle/three_checkin`, req)
    return data
}

const shareTwitter = async (req) => {
    const {data} = await ApiService.makeAuthRequest.post(`manager-event/weekly-raffle/check-share-twitter`, req)
    return data
}

const claimChristmas = async (req) => {
    const res = await ApiService.makeAuthRequest.post(`manager-event/claim-christmas`, req)
    return res
}

const getAdventEvent = async (event) => {
    window.__api_getAdventEvents = window.__api_getAdventEvents || {}
    if (window.__api_getAdventEvents[event]) {
        return window.__api_getAdventEvents[event]
    }

    window.__api_getAdventEvents[event] = ApiService.makeRequest.get(
        `web-event/advent-event/get-detail-event/${event}`,
        {
            baseURL: API_APP_URI,
        }
    )

    return window.__api_getAdventEvents[event].then((r) => {
        delete window.__api_getAdventEvents[event]

        return r
    })
}

const getAdventEventV2 = async (event) => {
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    const walletAddress = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))?.account

    if (accessToken !== null) {
        window.__api_getAdventEvents = window.__api_getAdventEvents || {}
        if (window.__api_getAdventEvents[event]) {
            return window.__api_getAdventEvents[event]
        }

        window.__api_getAdventEvents[event] = ApiService.makeAuthRequest.get(
            `web-event/advent-event/get-detail-event-v2/${event}`,
            {
                baseURL: API_APP_URI,
                headers: {
                    "Content-Type": "application/json",
                    "wallet_address": `${walletAddress}`,
                },
            }
        )

        return window.__api_getAdventEvents[event].then((r) => {
            delete window.__api_getAdventEvents[event]

            return r
        })
    } else if (walletAddress !== undefined) {
        const value = {
            wallet_address: walletAddress,
            time: Date.now(),
        }
        const key = CryptoJS.AES.encrypt(JSON.stringify(value), CYBER_ACCOUNT_KEY).toString()

        window.__api_getAdventEvents = window.__api_getAdventEvents || {}
        if (window.__api_getAdventEvents[event]) {
            return window.__api_getAdventEvents[event]
        }

        window.__api_getAdventEvents[event] = ApiService.makeRequest.get(
            `web-event/advent-event/get-detail-event-v2/${event}`,
            {
                baseURL: API_APP_URI,
                headers: {
                    "Content-Type": "application/json",
                    wallet_address: `${walletAddress}`,
                    key: key,
                },
            }
        )

        return window.__api_getAdventEvents[event].then((r) => {
            delete window.__api_getAdventEvents[event]

            return r
        })
    } else {
        window.__api_getAdventEvents = window.__api_getAdventEvents || {}
        if (window.__api_getAdventEvents[event]) {
            return window.__api_getAdventEvents[event]
        }

        window.__api_getAdventEvents[event] = ApiService.makeRequest.get(
            `web-event/advent-event/get-detail-event-v2/${event}`,
            {
                baseURL: API_APP_URI,
            }
        )

        return window.__api_getAdventEvents[event].then((r) => {
            delete window.__api_getAdventEvents[event]

            return r
        })
    }
}

const claimSummerFitsnap = async (req) => {
    const res = await ApiService.makeAuthRequest.post(`web-event/advent-event/claim-reward`, req, {
        baseURL: API_APP_URI,
    })
    return res
}
const claimLunarFestival = async (req) => {
    const res = await ApiService.makeAuthRequest.post(`web-event/advent-event/claim-reward`, req, {
        baseURL: API_APP_URI,
    })
    return res
}

const claimAdvent = async (req) => {
    const res = await ApiService.makeAuthRequest.post(`web-event/advent-event/claim-reward`, req, {
        baseURL: API_APP_URI,
    })
    return res
}

const claimOnChain = async ([req]) => {
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    const walletAddress = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))?.account
    let res
    if (accessToken !== null) {
        res = await ApiService.makeAuthRequest.post(`web-event/advent-event/claim-reward-v2`, req, {
            baseURL: API_APP_URI,
        })
    } else if (walletAddress !== null) {
        const value = {
            wallet_address: walletAddress,
            time: Date.now(),
        }
        const key = CryptoJS.AES.encrypt(JSON.stringify(value), CYBER_ACCOUNT_KEY).toString()
        res = await ApiService.makeRequest.post(`web-event/advent-event/claim-reward-v2`, req, {
            baseURL: API_APP_URI,
            headers: {
                "Content-Type": "application/json",
                wallet_address: `${walletAddress.toLowerCase()}`,
                key: key,
            },
        })
    }

    return res
}

const getDefaultEventData = (id, defaultValue = null) => {
    const key = `event-${id}`
    let value = sessionStorage.getItem(key)
    if (value) {
        try {
            value = JSON.parse(value)
            if (value) {
                return value
            }
        } catch (e) {
            //
        }
    }
    return defaultValue
}

const setDefaultEventData = (id, value) => {
    const key = `event-${id}`
    sessionStorage.setItem(key, JSON.stringify(value))
}

const EventService = {
    getDefaultEventData,
    setDefaultEventData,
    getEventById,
    claimMerchandise,
    claimRaffle,
    connectDiscord,
    checkHoldNft,
    getUserInfoByEvent,
    checkDiscord,
    signMessageViaSubWallet,
    dailyCheckin,
    threeCheckin,
    claimMintPass,
    connectTwitter,
    checkTwitter,
    shareTwitter,
    claimChristmas,
    getAdventEvent,
    getAdventEventV2,
    claimSummerFitsnap,
    claimLunarFestival,
    claimOnChain,
    claimAdvent
}

export default EventService

