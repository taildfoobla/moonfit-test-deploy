import React from "react"
import {isMobileOrTablet} from "../../core/utils/helpers/device"

const isMobile = isMobileOrTablet()

const ScrollAnimation = ({children, mobile = {}, desktop = {}}) => {
    const aosAttributes = isMobile ? {...mobile} : {...mobile, ...desktop}
    return <div {...aosAttributes}>{children}</div>
}

export default ScrollAnimation
