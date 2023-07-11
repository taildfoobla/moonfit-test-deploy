import React from "react"
import CurveBGWrapper from "../wrappers/CurveBG"
import RoundSoldOut from "../components/NFTSaleStages/round-sold-out";
import RoundWorldCup from "../components/NFTSaleStages/round-world-cup";

import { NFT_SALE_ROUNDS_INFO } from '../constants/blockchain'
import Round3 from "../components/NFTSaleStages/round-3";

const NFTSaleStages = () => {
    return (
        <CurveBGWrapper>
            <h2 className="stage-title ml-4 mb-12">MoonBEAST NFT SALE Stages</h2>
            <div className="flex flex-wrap justify-center grid grid-cols-4 gap-4 mb-7">
                {<RoundSoldOut stage={NFT_SALE_ROUNDS_INFO.R1} />}
                {<RoundSoldOut stage={NFT_SALE_ROUNDS_INFO.R2} />}
                {<RoundWorldCup />}
                <Round3 />
            </div>
        </CurveBGWrapper>
    )
}

export default NFTSaleStages
