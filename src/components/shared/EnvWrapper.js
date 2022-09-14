import React, {useEffect} from 'react'
import {getReactEnv} from "../../utils/env"
import {useHistory} from "react-router-dom"
import Paths from "../../routes/Paths"

const ENV = getReactEnv('ENV')


const EnvWrapper = ({routeItem, className, children}) => {
    const history = useHistory()
    useEffect(() => {
        const isDisabled = !routeItem.env.includes(ENV)

        if (isDisabled) {
            history.push(Paths.Home.path)
        }
    })

    return (
        <div className={`env-wrapper ${className || ''}`}>
            {children}
        </div>
    )
}

export default EnvWrapper