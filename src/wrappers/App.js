import React, {useState} from 'react'
import AppContext from "../contexts/AppContext"


const AppWrapper = ({children}) => {
    const [loading, setLoading] = useState(true)

    return (
        <AppContext.Provider value={{loading, setLoading}}>
            {children}
        </AppContext.Provider>
    )
}

export default AppWrapper
