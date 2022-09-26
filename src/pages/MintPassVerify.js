import React from 'react'
import Paths from "../routes/Paths"
import EnvWrapper from "../components/shared/EnvWrapper"
import CurveBGWrapper from "../wrappers/CurveBG"
import MintPassVerify from "../components/MintPassVerify"

const MintPassVerifyPage = (props) => {
    return (
        <CurveBGWrapper className="page-nft-sale">
            <EnvWrapper routeItem={Paths.MintPassVerify}>
                <div className="container">
                    <div className="flex flex-col">
                        <div className="flex justify-center"><h2 className="font-bold text-3xl secondary-color text-center">
                            Mint Pass <span className="text-white">Verify</span></h2>
                        </div>
                    </div>
                </div>

                <MintPassVerify key="MintPassVerify"/>
            </EnvWrapper>
        </CurveBGWrapper>
    )
}

export default MintPassVerifyPage
