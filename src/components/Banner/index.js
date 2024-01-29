import React from "react"
import BannerNotLoggedIn from "./NotLoggedIn"
import "./styles.less"
import BannerUserAssets from "./UserAssets";
import BannerUserNoAssets from "./UserNoAssets";
import BannerDownload from "./BannerDownload";

const Banner = ({isLoggedIn = true, hasAssets = false,highlightEvent}) => {
    const layout = !isLoggedIn ? "not-logged-in" : hasAssets ? "user-assets" : "user-no-assets"
    
    return (
        // <div className={`banner is-${layout}`}>
        <div className={`banner is-not-logged-in`}>
            {/* {
                !isLoggedIn ? <BannerNotLoggedIn /> : hasAssets ? <BannerUserAssets /> : <BannerUserNoAssets />
            } */}
            <BannerDownload highlightEvent={highlightEvent}/>
        </div>
    )
}

export default Banner
