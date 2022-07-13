import React from 'react'
import AppContext from "../contexts/AppContext"


const AppWrapper = ({children}) => {
    // const [loading, setLoading] = useState(true)

    return (
        <AppContext.Provider value={{}}>
            {children}
        </AppContext.Provider>
    )
}

export default AppWrapper
