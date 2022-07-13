import React from 'react'
import {getReactEnv} from "../../utils/env"
import {useHistory} from "react-router-dom"
import Paths from "../../routes/Paths"

const ENV = getReactEnv('ENV')


const EnvWrapper = ({routeItem, className, children}) => {
    const isDisabled = !routeItem.env.includes(ENV)
    const history = useHistory()

    if (isDisabled) {
        return history.push(Paths.Home.path)
    }

    return (
        <div className={`env-wrapper ${className || ''}`}>
            {children}
        </div>
    )
}

export default EnvWrapper