export const LOCALSTORAGE_KEY = {
    WALLET_ACCOUNT: 'WALLET_ACCOUNT',
    MF_ACCOUNT: 'MF_ACCOUNT',
    SESSION_ID: 'SESSION_ID',
    ACCESS_TOKEN: 'ACCESS_TOKEN',
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
