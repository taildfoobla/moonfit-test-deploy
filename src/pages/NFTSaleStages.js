import React from "react"
import CurveBGWrapper from "../wrappers/CurveBG"
import RoundSoldOut from "../components/NFTSaleStages/round-sold-out";
import RoundWorldCup from "../components/NFTSaleStages/round-world-cup";
import RoundComingSoon from "../components/NFTSaleStages/round-coming-soon";

import { NFT_SALE_ROUNDS_INFO } from '../constants/blockchain'

const NFTSaleStages = () => {
    return (
        <CurveBGWrapper>
            <h2 className="stage-title ml-4 mb-12">MoonBEAST NFT SALE Stages</h2>
            <div className="flex flex-wrap justify-center grid grid-cols-2 gap-8 mb-7">
                {<RoundSoldOut stage={NFT_SALE_ROUNDS_INFO.R1} />}
                {<RoundSoldOut stage={NFT_SALE_ROUNDS_INFO.R2} />}
            </div>
            <div className="flex flex-wrap justify-center grid xs:grid-cols-1 md:grid-cols-1 xl:grid-cols-3 gap-8">
                {<RoundComingSoon stage={NFT_SALE_ROUNDS_INFO.R3} />}
                {<RoundComingSoon stage={NFT_SALE_ROUNDS_INFO.R4} />}
                {<RoundWorldCup />}
            </div>
        </CurveBGWrapper>
    )
}

export default NFTSaleStages
