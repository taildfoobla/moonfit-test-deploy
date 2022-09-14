import React, {useEffect} from 'react'
import Paths from "../routes/Paths"
import CurveBGWrapper from "../wrappers/CurveBG"
import {useHistory} from "react-router-dom"

const NotFound = () => {
    const history = useHistory()

    const goToHome = () => {
        history.push(Paths.Home.path)
    }

    useEffect(() => {
        setTimeout(goToHome, 300)
    })

    const renderContent = () => {
        return (
            <div className={'grid grid-cols-1 xl:grid-cols-2 gap-4 items-center z-[99] mt-4'}>
                <div className={'flex landing-right-image-wrap justify-center pl-12 xl:pl-0 mt-12 xl:mt-0'}>
                    Page not found
                </div>
            </div>
        )
    }

    return (
        <CurveBGWrapper>
            <div className={`page-NotFound`}>
                {renderContent()}
            </div>
        </CurveBGWrapper>
    )
}

export default NotFound