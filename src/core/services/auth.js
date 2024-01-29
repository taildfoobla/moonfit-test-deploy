import ApiService from "./api"
import TokenService from "./token"

const isUserLogin = () => {
    return true
}

const login = async (reqData) => {
    try {
        const {data: resp} = await ApiService.makeRequest.post("/auth/get-all-account-by-wallet", reqData)
        return {
            success: true,
            data: resp,
        }
    } catch (e) {
        const {response} = e
        const message = response ? response.statusText : e.message || e
        const data = response ? response.data : ''
        return {
            success: false,
            message,
            data
        }
    }
}

const loginInCyberApp = async (reqData) => {
    try {
        const {data: resp} = await ApiService.makeRequest.post("/auth/get-all-account-by-cyber-account", reqData)
        return {
            success: true,
            data: resp,
        }
    } catch (e) {
        const {response} = e
        const message = response ? response.statusText : e.message || e
        const data = response ? response.data : ''
        return {
            success: false,
            message,
            data
        }
    }
}

const loginAfterChooseUser = async (reqData)=>{
    try {
        const {data: resp} = await ApiService.makeRequest.post("/auth/login-by-wallet-v2", reqData)
        return {
            success: true,
            data: resp,
        }
    } catch (e) {
        const {response} = e
        const message = response ? response.statusText : e.message || e
        const data = response ? response.data : ''
        return {
            success: false,
            message,
            data
        }
    }
}

const loginAfterChooseUserCyberApp = async (reqData)=>{
    try {
        const {data: resp} = await ApiService.makeRequest.post("/auth/login-by-cyber-account", reqData)
        return {
            success: true,
            data: resp,
        }
    } catch (e) {
        const {response} = e
        const message = response ? response.statusText : e.message || e
        const data = response ? response.data : ''
        return {
            success: false,
            message,
            data
        }
    }
}

const getAccessToken = async (reqData)=>{
    try {
        const {data: resp} = await ApiService.makeRequest.post("/auth/refresh-token", reqData)
        return {
            success: true,
            data: resp,
        }
    } catch (e) {
        const {response} = e
        const message = response ? response.statusText : e.message || e
        const data = response ? response.data : ''
        return {
            success: false,
            message,
            data
        }
    }
}

const logout = () => {
    TokenService.clearTokens()
}

const AuthService = {
    logout,
    login,
    loginInCyberApp,
    loginAfterChooseUser,
    loginAfterChooseUserCyberApp,
    getAccessToken,
    isUserLogin,
}

export default AuthService
