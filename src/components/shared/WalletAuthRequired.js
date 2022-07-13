import React from 'react'
import {getReactEnv} from "../../utils/env"

const SUBWALLET_EXT_URL = getReactEnv('SUBWALLET_EXT')


const WalletAuthRequired = ({isConnected, onConnect, children, className}) => {
    const isSubWalletInstalled = Boolean(window?.injectedWeb3 && window?.SubWallet)

    const renderContent = () => {
        if (!isSubWalletInstalled) {
            return (
                <div className={'flex flex-col justify-center items-center pt-36 mt-28'}>
                    <h2 className={'flex font-bold text-4xl secondary-color'}>MoonFit X SubWallet</h2>
                    <div className={'mt-5'}>
                        You must install SubWallet to perform this action
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
                <div className={'flex flex-col justify-center items-center pt-36 mt-28'}>
                    <h2 className={'flex font-bold text-4xl secondary-color'}>MoonFit X SubWallet</h2>
                    <div className={'mt-5'}>
                        You must login with SubWallet to perform this action
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