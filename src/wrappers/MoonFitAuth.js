import React, {useState} from 'react'
import MoonFitAuthContext from "../contexts/MoonFitAuthContext"


const MoonFitAuthWrapper = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState({})

    // const history = useHistory()

    return (
        <MoonFitAuthContext.Provider value={{user, isAuthenticated}}>
            {children}
        </MoonFitAuthContext.Provider>
    )
}

export default MoonFitAuthWrapper
