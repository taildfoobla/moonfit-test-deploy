import React, {useEffect, useState} from 'react'
import AppContext from "../contexts/AppContext"


const AppWrapper = ({children}) => {
    const [loading, setLoading] = useState(true)

    // useEffect(() => {
    //     setLoading(true)
    // }, [children])

    return (
        <AppContext.Provider value={{loading, setLoading}}>
            {children}
        </AppContext.Provider>
    )
}

export default AppWrapper
