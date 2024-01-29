import React from 'react'
import "./styles.less"

import beast1 from "../../assets/images/bounty-spin/background/coin-1.png"
import beauty1 from "../../assets/images/bounty-spin/background/coin-2.png"
import beauty3 from "../../assets/images/bounty-spin/background/coin-3.png"
import tokenMfr1 from "../../assets/images/bounty-spin/background/coin-4.png"
import tokenMfr2 from "../../assets/images/bounty-spin/background/coin-5.png"
import tokenMfg3 from "../../assets/images/bounty-spin/background/coin-6.png"


export default function BeastBackground() {
  return (
   <div className='beast-background-container'>
     <div className="section-shape section-shape-beast-1 move-vertical-reversed">
                <img loading="lazy" src={beast1} width="108" height="108" alt="" />
            </div>
            <div className="section-shape section-shape-beauty-1 move-vertical-reversed">
                <img loading="lazy" src={beauty1} width="119" alt="" />
            </div>
            <div className="section-shape section-shape-beauty-2 move-vertical">
                <img loading="lazy" src={beauty3} width="101" height="120" alt="" />
            </div>
            <div className="section-shape section-shape-mfg-2 move-vertical">
                <img loading="lazy" src={tokenMfg3} width="60" height="60" alt="" />
            </div>
            <div className="section-shape section-shape-mfr-1 move-vertical">
                <img loading="lazy" src={tokenMfr1} width="74" height="67" alt="" />
            </div>
            <div className="section-shape section-shape-mfr-2 move-vertical">
                <img loading="lazy" src={tokenMfr2} width="60" height="60" alt="" />
            </div></div>
  )
}
