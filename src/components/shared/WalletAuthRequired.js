import React from 'react'
import {getReactEnv} from "../../utils/env"
import mfBrand from "../../assets/images/brand.png"
import mpCard from "../../assets/images/mint-pass-landing-card.png"

const SUBWALLET_EXT_URL = getReactEnv('SUBWALLET_EXT')


const WalletAuthRequired = ({isConnected, onConnect, children, className}) => {
    const isSubWalletInstalled = Boolean(window?.injectedWeb3 && window?.SubWallet)

    const renderContent = () => {
        if (!isSubWalletInstalled) {
            return (
                <div className={'flex lg:justify-start justify-center items-center'}>
                    <div className={'flex flex-col landing-text-wrap lg:justify-start justify-center'}>
                        <div className="flex brand-image">
                            <img loading="lazy" src={mfBrand}
                                 alt="Moonfit Branding"
                                 width="356"/>
                        </div>
                        <h1 className="section-title">Get your <span
                            className="secondary-color">mint pass</span>
                        </h1>
                        <div className="section-description-wrap text-left lg-text-center">
                            <p className="section-description">Mint Pass is a pre-mint invitation that will secure your spot and enable you to purchase your MoonFit Beast & Beauty.</p>
                        </div>
                        <div className={'flex mt-8'}>
                        <button type="button"
                                onClick={() => {
                                    window.open(SUBWALLET_EXT_URL)
                                }}
                                className="button button-subwallet">
                            Install SubWallet to Start
                        </button>
                        </div>
                    </div>
                    <div className={'hidden xl:flex landing-right-image-wrap'}>
                        <img src={mpCard} alt="Mint Pass" width={350}/>
                    </div>
                </div>
            )
        } else if (!isConnected) {
            return (
                <div className={'flex lg:justify-start justify-center items-center'}>
                    <div className={'flex flex-col landing-text-wrap lg:justify-start justify-center'}>
                        <div className="flex brand-image">
                            <img loading="lazy" src={mfBrand}
                                 alt="Moonfit Branding"
                                 width="356"/>
                        </div>
                        <h1 className="section-title">Get your <span
                            className="secondary-color">mint pass</span>
                        </h1>
                        <div className="section-description-wrap text-left lg-text-center">
                            <p className="section-description">Mint Pass is a pre-mint invitation that will secure your spot and enable you to purchase your MoonFit Beast & Beauty.</p>
                        </div>
                        <div className={'flex mt-8'}>
                            <button type="button"
                                    onClick={onConnect}
                                    className="button button-subwallet">
                                Login with SubWallet
                            </button>
                        </div>
                    </div>
                    <div className={'hidden xl:flex landing-right-image-wrap'}>
                        <img src={mpCard} alt="Mint Pass" width={350}/>
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