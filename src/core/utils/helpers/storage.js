export const LOCALSTORAGE_KEY = {
    SELECTED_ASSET:"SELECTED_ASSET",
    wagmi_store:"wagmi.store",
    wagmi_connected:"wagmi.connected",
    SOCIAL_ACOUNT:"SOCIAL_ACOUNT",
    SELECTED_NETWORK:'SELECTED_NETWORK',
    WHEEL_REWARDS:'WHEEL_REWARDS', 
    FIRST_SHOW_IN_DAY:'FIRST_SHOW_IN_DAY',
    SELECTED_USER_ID:'SELECTED_USER_ID',
    REFRESH_TOKEN:'REFRESH_TOKEN',
    WALLET_ACCOUNT: 'WALLET_ACCOUNT',
    WALLET_SIGNATURE:'WALLET_SIGNATURE',
    MF_ACCOUNT: 'MF_ACCOUNT',
    SESSION_ID: 'SESSION_ID',
    ACCESS_TOKEN: 'ACCESS_TOKEN',
    WALLET_EXT: 'WALLET_EXT',
    NETWORK: 'NETWORK',
    WC_CONNECTOR: 'WC_CONNECTOR',
    MF_CURRENT_EVENT: 'MF_CURRENT_EVENT',
    SPECIAL_EVENT_WINNERS: 'SPECIAL_EVENT_WINNERS'
}

export const getLocalStorage = (name, defaultValue = null) => {
    return localStorage.getItem(name) || defaultValue
}

export const setLocalStorage = (name, value) => {
    return localStorage.setItem(name, value)
}

export const removeLocalStorage = (name) => {
    return localStorage.removeItem(name)
}

export const getLocalStorageObject = () => {
    return localStorage
}
