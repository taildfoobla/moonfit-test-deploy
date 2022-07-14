import React from 'react'
import {getReactEnv} from "../../utils/env"
import mfBrand from "../../assets/images/brand.png"

const SUBWALLET_EXT_URL = getReactEnv('SUBWALLET_EXT')


const WalletAuthRequired = ({isConnected, onConnect, children, className}) => {
    const isSubWalletInstalled = Boolean(window?.injectedWeb3 && window?.SubWallet)

    const renderContent = () => {
        if (!isSubWalletInstalled) {
            return (
                <div className={'flex flex-col justify-center items-center pt-28'}>
                    <div className="container">
                        <div className="flex justify-center brand-image">
                            <img loading="lazy" src={mfBrand}
                                 alt="Moonfit Branding"
                                 width="520"/>
                        </div>
                        <h1 className="section-title text-center">WEB3 & NFT <br/><span
                            className="secondary-color">LIFESTYLE APP</span>
                        </h1>
                        <div className="section-description-wrap">
                            <p className="section-description">You must login with SubWallet to perform this action</p>
                        </div>
                    </div>
                    <div className={'flex mt-12'}>
                        <button type="button"
                                onClick={() => {
                                    window.open(SUBWALLET_EXT_URL)
                                }}
                                className="button button-primary">
                            Install SubWallet to Start
                        </button>
                    </div>
                </div>
            )
        } else if (!isConnected) {
            return (
                <div className={'flex flex-col justify-center items-center pt-28'}>
                    <div className="container">
                        <div className="flex justify-center brand-image">
                            <img loading="lazy" src={mfBrand}
                                 alt="Moonfit Branding"
                                 width="520"/>
                        </div>
                        <h1 className="section-title text-center">WEB3 & NFT <br/><span
                            className="secondary-color">LIFESTYLE APP</span>
                        </h1>
                        <div className="section-description-wrap">
                            <p className="section-description">You must login with SubWallet to perform this action</p>
                        </div>
                    </div>
                    <div className={'flex mt-12'}>
                        <button type="button"
                                onClick={onConnect}
                                className="button button-primary">
                            Login with SubWallet
                        </button>
                    </div>
                </div>
            )
        } else {
            return children
        }
    }

    return (
        <div className={`wallet-auth-required ${className || ''}`}>
            {renderContent()}
        </div>
    )
}

export default WalletAuthRequired