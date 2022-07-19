import React from 'react'
import kusamaV2 from "../assets/images/shapes/kusama-v2.png"
import beast from "../assets/images/shapes/beast-3.png"
import beauty from "../assets/images/shapes/beauty-4.png"
import beauty2 from "../assets/images/shapes/beauty-5.png"
import polkadot from "../assets/images/shapes/polkadot-v2.png"
import tokenMFR2 from "../assets/images/shapes/token-mfr.png"
import tokenMFR from "../assets/images/token-mfr.png"
import tokenMFG from "../assets/images/shapes/token-mfg.png"
import WebFooter from "../components/shared/WebFooter"


const CurveBGWrapper = ({children}) => {
    return (
        <div id="main-content" className="main-content page-content section-hero">
            <div className="section-shape section-shape-kusama move-vertical">
                <img loading="lazy" src={kusamaV2} alt="Kusama" width="258"
                     height="256"/>
            </div>
            <div className="section-shape section-shape-beast move-vertical">
                <img loading="lazy" src={beast} alt="Beast" width="231"
                     height="230"/>
            </div>
            <div className="section-shape section-shape-beauty move-vertical-reversed">
                <img loading="lazy" src={beauty} alt="Beauty" width="181" height="216"/>
            </div>
            <div className="section-shape section-shape-beauty-2 move-vertical">
                <img loading="lazy" src={beauty2} alt="Beauty 2" width="148" height="176"/>
            </div>
            <div className="section-shape section-shape-polkadot move-vertical-reversed">
                <img loading="lazy" src={polkadot} alt="Polkadot" width="218"
                     height="223"/>
            </div>
            <div className="section-shape shape-token-mfr-1 move-vertical-reversed">
                <img loading="lazy" src={tokenMFR} alt="shape"
                     width="57"
                     height="66"/>
            </div>
            <div className="section-shape shape-token-mfr-2">
                <img loading="lazy" src={tokenMFR2} alt="shape" className="move-vertical"
                     width="50"
                     height="40"/>
            </div>
            <div className="section-shape shape-token-mfg-2">
                <img loading="lazy" src={tokenMFG} alt="shape"
                     width="59"
                     height="56" className="move-vertical-reversed"/>
            </div>
            <div className={'page-container'}>
                {children}
            </div>
            <WebFooter/>
        </div>
    )
}

export default CurveBGWrapper
