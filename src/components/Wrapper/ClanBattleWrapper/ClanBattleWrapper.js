import React from "react"
import beast1 from "../../../assets/images/shapes/beast-1.png"
import beast2 from "../../../assets/images/shapes/beast-2.png"
import beauty1 from "../../../assets/images/shapes/beauty-1.png"
import beauty2 from "../../../assets/images/shapes/beauty-2.png"
import star1 from "../../../assets/images/shapes/star-1.png"
import star2 from "../../../assets/images/shapes/star-2.png"
import star3 from "../../../assets/images/shapes/star-3.png"
import tokenMfg2 from "../../../assets/images/shapes/token-mfg-2.png"
import tokenMfg3 from "../../../assets/images/shapes/token-mfg-3.png"
import tokenMfr1 from "../../../assets/images/shapes/token-mfr-1.png"
import tokenMfr2 from "../../../assets/images/shapes/token-mfr-2.png"
import "./styles.less"

const ClanBattleWrapper = ({ children }) => {
    return (
        <div className="clan-battle-wrapper">
            <div className="section-shape section-shape-beast-1 move-vertical-reversed">
                <img loading="lazy" src={beast1} width="231"
                    height="230" alt="" />
            </div>
            <div className="section-shape section-shape-beast-2 move-vertical">
                <img loading="lazy" src={beast2} width="195" height="210" alt="" />
            </div>
            <div className="section-shape section-shape-beauty-1 move-vertical-reversed">
                <img loading="lazy" src={beauty1} width="181" height="216" alt="" />
            </div>
            <div className="section-shape section-shape-beauty-2 move-vertical">
                <img loading="lazy" src={beauty2} width="152" height="184" alt="" />
            </div>
            <div className="section-shape section-shape-star-1 move-vertical">
                <img loading="lazy" src={star1} width="30"
                    height="30" alt="" />
            </div>
            <div className="section-shape section-shape-star-2 move-vertical-reversed">
                <img loading="lazy" src={star2} width="30"
                    height="30" alt="" />
            </div>
            <div className="section-shape section-shape-star-3 move-vertical">
                <img loading="lazy" src={star1} width="30"
                    height="30" alt="" />
            </div>
            <div className="section-shape section-shape-star-4 move-vertical-reversed">
                <img loading="lazy" src={star3} width="30"
                    height="30" alt="" />
            </div>
            <div className="section-shape section-shape-star-5 move-vertical">
                <img loading="lazy" src={star2} width="30"
                    height="30" alt="" />
            </div>
            <div className="section-shape section-shape-star-6 move-vertical-reversed">
                <img loading="lazy" src={star3} width="30"
                    height="30" alt="" />
            </div>
            <div className="section-shape section-shape-star-7 move-vertical-reversed">
                <img loading="lazy" src={star2} width="35"
                    height="35" alt="" />
            </div>
            <div className="section-shape section-shape-mfg-1 move-vertical">
                <img loading="lazy" src={tokenMfg2} width="60"
                    height="60" alt="" />
            </div>
            <div className="section-shape section-shape-mfg-2 move-vertical">
                <img loading="lazy" src={tokenMfg3} width="60"
                    height="60" alt="" />
            </div>
            <div className="section-shape section-shape-mfr-1 move-vertical">
                <img loading="lazy" src={tokenMfr1} width="60"
                    height="60" alt="" />
            </div>
            <div className="section-shape section-shape-mfr-2 move-vertical">
                <img loading="lazy" src={tokenMfr2} width="60"
                    height="60" alt="" />
            </div>
            <>
                {children}
            </>
        </div>
    )
}

export default ClanBattleWrapper