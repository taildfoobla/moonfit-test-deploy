import React, {useEffect, useState} from 'react'
import MoonFitAuthContext from "../contexts/MoonFitAuthContext"
import {getLocalStorage, LOCALSTORAGE_KEY, removeLocalStorage} from "../utils/storage"


const MoonFitAuthWrapper = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState({})

    useEffect(() => {
        const storageUser = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.MF_ACCOUNT))
        if (storageUser) {
            const {userId = null} = storageUser
            userId && setUser(storageUser)
            setIsAuthenticated(true)
        }
    }, [])

    const logoutAccount = () => {
        removeLocalStorage(LOCALSTORAGE_KEY.MF_ACCOUNT)
        removeLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
        setUser({})
        setIsAuthenticated(false)
    }

    return (
        <MoonFitAuthContext.Provider value={{user, setUser, isAuthenticated, logoutAccount, setIsAuthenticated}}>
            {children}
        </MoonFitAuthContext.Provider>
    )
}

export default MoonFitAuthWrapper
