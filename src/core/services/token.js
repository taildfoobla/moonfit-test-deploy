const getLocalRefreshToken = () => {
    return localStorage.getItem("REFRESH_TOKEN")
}

const getLocalAccessToken = () => {
    return localStorage.getItem("ACCESS_TOKEN")
}

const updateLocalAccessToken = () => {

}

const clearTokens = () => {

}

const TokenService = {
    getLocalRefreshToken,
    getLocalAccessToken,
    updateLocalAccessToken,
    clearTokens
}

export default TokenService
