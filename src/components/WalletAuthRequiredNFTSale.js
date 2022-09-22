import React, {useContext} from 'react'
import mfBrand from "../assets/images/brand.png"
import nftCard from "../assets/images/universe-image.png"
import WalletAuthContext from "../contexts/WalletAuthContext"
import {CountdownComponent} from "./CountdownComponent"
import {NFT_SALE_CURRENT_INFO} from "../constants/blockchain"

const WalletAuthRequiredNFTSale = ({children, className}) => {
    const {isConnected, showWalletSelectModal} = useContext(WalletAuthContext)
    const currentSale = NFT_SALE_CURRENT_INFO
    const isStarted = currentSale.time && currentSale.time <= new Date().getTime()

    // const isSubWalletInstalled = Boolean((window?.injectedWeb3 && window[PROVIDER_NAME.SubWallet]) || (window[PROVIDER_NAME.MetaMask]))

    const renderContent = () => {
        return !isConnected ? (
            <div className={'grid grid-cols-1 xl:grid-cols-2 gap-4 items-center z-[99]'}>
                <div className={'flex flex-col landing-text-wrap xl:justify-start justify-center z-[9]'}>
                    <div className="lg:hidden flex brand-image justify-center xl:justify-start">
                        <img loading="lazy" src={mfBrand} alt="Moonfit Branding" width="356"/>
                    </div>
                    <h1 className="section-title flex flex-col justify-center xl:justify-start">
                        <span className={'text-center xl:text-left secondary-color text-4xl xl:text-5xl'}>
                            {NFT_SALE_CURRENT_INFO.title}
                        </span>
                        <span className="text-center xl:text-left text-2xl xl:text-3xl my-2 xl:my-3">
                            {NFT_SALE_CURRENT_INFO.dateMsg}
                        </span>
                    </h1>
                    <div className="section-description-wrap text-center xl:text-left">
                        <div className={'flex items-center mt-8 xl:justify-start justify-center'}>
                            {isStarted ? null : (<div className={'hidden md:block normal-case mr-2 text-white text-base'}>Start in:</div>)}
                            <div className={'flex justify-center'}>
                                <CountdownComponent
                                    date={NFT_SALE_CURRENT_INFO.time}
                                    // completedCallback={() => window.location.reload()}
                                    completedMessage={`NFT Sale #${NFT_SALE_CURRENT_INFO.number} have been started`}/>
                            </div>
                        </div>
                    </div>
                    <div className={'flex mt-8 justify-center xl:justify-start'}>
                        <button type="button"
                                onClick={showWalletSelectModal}
                                className="button button-primary">
                            Connect Wallet
                        </button>
                    </div>
                </div>
                <div className={'flex landing-right-image-wrap justify-center pr-12 xl:pr-0 mt-12 xl:mt-0'}>
                    <img src={nftCard} alt="NFT Card"/>
                </div>
            </div>
        ) : children
    }

    return (
        <div className={`wallet-auth-required-nft-sale ${className || ''}`}>
            {renderContent()}
        </div>
    )
}

export default WalletAuthRequiredNFTSale
