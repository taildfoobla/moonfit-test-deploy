import React from 'react'
import {renderRoutes} from "react-router-config"
import WebNavigation from "./components/shared/WebNavigation"
import WebFooter from "./components/shared/WebFooter"
import promotionBg from "./assets/images/promoting-bg.jpg"
import mediumSatellite1 from "./assets/images/shapes/medium-satellite-1.png"
import mediumSatellite2 from "./assets/images/shapes/medium-satellite-2.png"
import kusamaV2 from "./assets/images/shapes/kusama-v2.png"
import polkadot from "./assets/images/shapes/polkadot-v2.png"
import tokenMFR from "./assets/images/token-mfr.png"
import tokenMFG from "./assets/images/shapes/token-mfg.png"
import MoonFitAuthWrapper from "./wrappers/MoonFitAuth"
import AppWrapper from "./wrappers/App"
import WalletAuthWrapper from "./wrappers/WalletAuth"


const App = ({route}) => {

    return (
        <AppWrapper>
            <MoonFitAuthWrapper>
                <WalletAuthWrapper>
                    <div>
                        <div className="section-effect-snow site-effect-snow" data-firefly-total="50"></div>
                        <WebNavigation/>
                        <div id="main-content" className="main-content page-content">
                            <div className="section-shape section-shape-promoting-bg">
                                <img loading="lazy" src={promotionBg} alt="Promoting an active lifestyle"
                                     width="1920"
                                     height="340"/>
                            </div>
                            <div className="section-shape section-shape-satellite-1">
                                <img loading="lazy" src={mediumSatellite1} alt="satellite"
                                     width="229" height="224"/>
                            </div>
                            <div className="section-shape section-shape-satellite-2">
                                <img loading="lazy" src={mediumSatellite2} alt="satellite"
                                     width="407" height="490"/>
                            </div>
                            <div className="section-shape section-shape-kusama move-vertical">
                                <img loading="lazy" src={kusamaV2} alt="Kusama" width="238"
                                     height="237"/>
                            </div>
                            <div className="section-shape section-shape-polkadot move-vertical-reversed">
                                <img loading="lazy" src={polkadot} alt="Polkadot" width="218"
                                     height="223"/>
                            </div>
                            <div className="section-shape shape-token-mfr-1 move-vertical-reversed">
                                <img loading="lazy" src={tokenMFR} alt="shape"
                                     width="70"
                                     height="70"/>
                            </div>
                            <div className="section-shape shape-token-mfr-2">
                                <img loading="lazy" src={tokenMFR} alt="shape" className="move-vertical"
                                     width="70"
                                     height="70"/>
                            </div>
                            <div className="section-shape shape-token-mfg-1">
                                <img loading="lazy" src={tokenMFG} alt="shape" width="71"
                                     height="51" className="move-vertical-reversed"/>
                            </div>
                            <div className="section-shape shape-token-mfg-2">
                                <img loading="lazy" src={tokenMFG} alt="shape"
                                     width="70"
                                     height="70" className="move-vertical-reversed"/>
                            </div>
                            <div className={'page-container'}>
                                {renderRoutes(route.routes)}
                            </div>
                        </div>
                        <WebFooter/>
                    </div>
                </WalletAuthWrapper>
            </MoonFitAuthWrapper>
        </AppWrapper>
    )
}

export default App
