import React, {useContext} from 'react'
import mfBrand from "../assets/images/brand.png"
import WalletAuthContext from "../contexts/WalletAuthContext"
// import nftCard from "../assets/images/universe-image.png"
import nftCard from "../assets/images/hero-image.png"
import EnvWrapper from "../components/shared/EnvWrapper"
import Paths from "../routes/Paths"
import CurveBGWrapper from "../wrappers/CurveBG"
import {useHistory} from "react-router-dom"


const Home = (props) => {
    const {isConnected, showWalletSelectModal} = useContext(WalletAuthContext)
    const history = useHistory()

    // const isSubWalletInstalled = Boolean((window?.injectedWeb3 && window[PROVIDER_NAME.SubWallet]) || (window[PROVIDER_NAME.MetaMask]))

    const renderContent = () => {
        return (
            // <div className={'px-3 lg:px-auto lg:flex lg:justify-start justify-center items-center'}>
            <div className={'grid grid-cols-1 xl:grid-cols-2 gap-4 items-center z-[99] mt-4'}>
                <div className={'flex flex-col landing-text-wrap xl:justify-start justify-center z-[9]'}>
                    <div className="flex brand-image justify-center xl:justify-start">
                        <img loading="lazy" src={mfBrand}
                             alt="Moonfit Branding"
                             width="356"/>
                    </div>
                    <h1 className="section-title flex flex-col justify-center xl:justify-start">
                        <span className={'text-center xl:text-left'}>Web3 & NFT&nbsp;</span>
                        <span className="text-center xl:text-left secondary-color">Lifestyle App</span>
                    </h1>
                    <div className="section-description-wrap text-center xl:text-left">
                        <p className="section-description mx-auto xl:mx-0">
                            MoonFit is a Web3 Lifestyle App that promotes active living by rewarding users with tokens
                            and NFTs anytime they burn calories through physical activities.
                        </p>
                    </div>
                    <div className={'flex mt-8 justify-center xl:justify-start'}>
                        {
                            isConnected ? (
                                <div>
                                    <button type="button"
                                            onClick={() => history.push(Paths.MintPassMinting.path)}
                                            className="button button-primary">
                                        Mint Pass
                                    </button>
                                    <button type="button"
                                            onClick={() => history.push(Paths.NFTSale.path)}
                                            className="button button-secondary">
                                        NFT Sale
                                    </button>
                                </div>
                            ) : (
                                <button type="button"
                                        onClick={showWalletSelectModal}
                                        className="button button-primary">
                                    Connect Wallet
                                </button>
                            )
                        }
                    </div>
                </div>
                {/*<div className={'hidden xl:block landing-right-image-wrap'}>*/}
                <div className={'flex landing-right-image-wrap justify-center pl-8 xl:pl-0 mt-12 xl:mt-0'}>
                    <img src={nftCard} alt="NFT Card"/>
                </div>
            </div>
        )
    }

    return (
        <CurveBGWrapper>
            <EnvWrapper routeItem={Paths.Home}>
                <div className={`page-home`}>
                    {renderContent()}
                </div>
            </EnvWrapper>
        </CurveBGWrapper>
    )
}

export default Home