import React from 'react'
import beast from "../assets/images/shapes/beast-3.png"
import beauty from "../assets/images/shapes/beauty-4.png"
import beauty2 from "../assets/images/shapes/beauty-5.png"
import tokenMFR2 from "../assets/images/shapes/token-mfr.png"
import tokenMFR from "../assets/images/token-mfr.png"
import tokenMFG from "../assets/images/shapes/token-mfg.png"
import WebFooter from "../components/shared/WebFooter"
import beautyCard1 from "../assets/images/shapes/beauty-card-1.png"
import beautyCard2 from "../assets/images/shapes/beauty-card-2.png"
import beautyCard3 from "../assets/images/shapes/beauty-card-3.png"
import beastCard1 from "../assets/images/shapes/beast-card-1.png"
import mintPassCard from "../assets/images/shapes/mint-pass-card.png"

const NftSaleBGWrapper = ({ children, className = '' }) => {
    return (
        <div id="main-content" className="main-content page-content section-hero">
            <div className="section-shape section-shape-beauty-card-2 move-vertical-reversed">
                <img loading="lazy" src={beautyCard2} alt="Beast" width="200"
                    height="200" />
            </div>
            <div className="section-shape section-shape-mint-pass-1 move-vertical">
                <img loading="lazy" src={mintPassCard} alt="Beast" width="231"
                    height="230" />
            </div>
            <div className="section-shape section-shape-beast-card-1 move-vertical-reversed">
                <img loading="lazy" src={beastCard1} alt="Beast" width="200"
                    height="200" />
            </div>
            <div className="section-shape section-shape-beast-nft move-vertical">
                <img loading="lazy" src={beast} alt="Beast" width="231"
                    height="230" />
            </div>
            <div className="section-shape section-shape-beauty-card-1 move-vertical">
                <img loading="lazy" src={beautyCard1} alt="Beast" width="200"
                    height="200" />
            </div>
            <div className="section-shape section-shape-mint-pass-2 move-vertical-reversed">
                <img loading="lazy" src={mintPassCard} alt="Beast" width="231"
                    height="230" />
            </div>
            <div className="section-shape section-shape-beauty-card-3 move-vertical">
                <img loading="lazy" src={beautyCard3} alt="Beast" width="200"
                    height="200" />
            </div>
            <div className="section-shape section-shape-beauty-nft move-vertical-reversed">
                <img loading="lazy" src={beauty} alt="Beauty" width="181" height="216" />
            </div>
            <div className="section-shape section-shape-beauty-2-nft move-vertical-reversed">
                <img loading="lazy" src={beauty2} alt="Beauty 2" width="148" height="176" />
            </div>
            <div className="section-shape shape-token-mfr-nft-1 move-vertical-reversed">
                <img loading="lazy" src={tokenMFR} alt="shape"
                    width="57"
                    height="66" />
            </div>
            <div className="section-shape shape-token-mfr-nft-2">
                <img loading="lazy" src={tokenMFR2} alt="shape" className="move-vertical"
                    width="50"
                    height="40" />
            </div>
            <div className="section-shape shape-token-mfg-nft-2">
                <img loading="lazy" src={tokenMFG} alt="shape"
                    width="59"
                    height="56" className="move-vertical-reversed" />
            </div>
            <div className={`page-container ${className}`}>
                {children}
            </div>
            <WebFooter />
        </div>
    )
}

export default NftSaleBGWrapper
