import React from 'react'
import kusama from "../assets/images/shapes/kusama.png"
import rmrk from "../assets/images/shapes/rmrk.png"
import moonbeam from "../assets/images/shapes/moonbeam.png"
import acala from "../assets/images/shapes/acala.png"
import polkadot from "../assets/images/shapes/polkadot.png"
import WebFooter from "../components/shared/WebFooter"
// import tokenMFR from "../assets/images/token-mfr.png"
// import tokenMFG from "../assets/images/shapes/token-mfg.png"


const TownBGWrapper = ({children}) => {
    return (
        <div id="main-content" className="main-content page-content section-hero">
            <div className="section-shape section-hero-shape-meteor">
                <div className="meteor-shower">
                    <div className="meteor">
                        <div className="drop"></div>
                    </div>
                    <div className="meteor">
                        <div className="drop"></div>
                    </div>
                    <div className="meteor">
                        <div className="drop"></div>
                    </div>
                </div>
            </div>
            <div className="section-shape section-shape-kusama">
                <div className="move-vertical">
                    <img src={kusama} alt="Kusama" width="106" height="106"/>
                </div>
            </div>

            <div className="section-shape section-shape-rmrk">
                <div className="move-vertical">
                    <img src={rmrk} alt="RMRK" width="128" height="128"/>
                </div>
            </div>
            <div className="section-shape section-shape-moonbeam">
                <div className="move-vertical-reversed">
                    <img src={moonbeam} alt="Moonbeam" width="110" height="110"/>
                </div>
            </div>
            <div className="section-shape section-shape-acala">
                <div className="move-vertical">
                    <img src={acala} alt="Acala" width="142" height="142"/>
                </div>
            </div>
            <div className="section-shape section-shape-polkadot">
                <div className="move-vertical-reversed">
                    <img src={polkadot} alt="Polkadot" width="108" height="108"/>
                </div>
            </div>
            <div className={'page-container not-limit-width'}>
                {children}
            </div>
            <WebFooter/>
        </div>
    )
}

export default TownBGWrapper
