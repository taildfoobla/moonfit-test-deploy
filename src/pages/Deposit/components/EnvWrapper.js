import React, {useEffect} from 'react'
import {getReactEnv} from "../../../core/utils-app/env"
// import {useHistory} from "react-router-dom"
import { useNavigate } from 'react-router-dom'
import Paths from "./Paths"

const ENV = getReactEnv('ENV')


const EnvWrapper = ({routeItem, className, children}) => {
   const navigate=useNavigate()
    useEffect(() => {
        const isDisabled = !routeItem.env.includes(ENV)

        if (isDisabled) {
            navigate(Paths.Home.path)
        }
    })

    return (
        <div className={`env-wrapper ${className || ''}`}>
            {children}
        </div>
    )
}

export default EnvWrapper