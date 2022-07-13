import React, {useContext} from 'react'
import mfBrand from "../assets/images/brand.png"
import WalletAuthContext from "../contexts/WalletAuthContext"
import {getReactEnv} from "../utils/env"
import {useHistory} from "react-router-dom"
import {HomeActions} from "../routes/AppRoutes"
import EnvWrapper from "../components/shared/EnvWrapper"
import Paths from "../routes/Paths"

const SUBWALLET_EXT_URL = getReactEnv('SUBWALLET_EXT')
const ENV = getReactEnv('ENV')


const Home = (props) => {
    const {wallet, onConnect} = useContext(WalletAuthContext)
    const history = useHistory()

    const renderButton = () => {
        const isSubWalletInstalled = Boolean(window?.injectedWeb3 && window?.SubWallet)
        if (!isSubWalletInstalled) {
            return (
                <div className={'mt-12'}>
                    <button type="button"
                            onClick={() => {
                                window.open(SUBWALLET_EXT_URL)
                            }}
                            className="button button-primary">
                        Install SubWallet to Start
                    </button>
                </div>
            )
        } else if (!wallet.account) {
            return (
                <div className={'mt-12'}>
                    <button type="button"
                            onClick={onConnect}
                            className="button button-primary">
                        Login with SubWallet
                    </button>
                </div>
            )
        } else {
            return (
                <div className={'flex mt-12 justify-center items-center'}>
                    {renderHomeActions()}
                </div>
            )
        }
    }

    const renderHomeActions = () => {
        return HomeActions.map((item, index) => {
            const isDisabled = !item.env.includes(ENV)
            const baseClass = index % 2 === 0 ? "button button-primary" : "button button-secondary"
            const extraClass = isDisabled ? " cursor-not-allowed" : " "
            const className = baseClass + extraClass
            return (
                <button type="button"
                    // disabled={isDisabled}
                        onClick={() => !isDisabled && history.push(item.path)}
                        className={className}>
                    {item.title} {isDisabled && "(Coming soon)"}
                </button>
            )
        })
    }

    return (
        <EnvWrapper routeItem={Paths.Home}>
            <div className="page-home">
                <div className="section">
                    <div className="section-content">
                        <div className="container">
                            <div className="flex justify-center brand-image">
                                <img loading="lazy" src={mfBrand}
                                     alt="Moonfit Branding"
                                     width="520"/>
                            </div>
                            <h1 className="section-title">WEB3 & NFT <br/><span
                                className="secondary-color">LIFESTYLE APP</span>
                            </h1>
                            <div className="section-description-wrap">
                                <p className="section-description">That Pays You For Doing Exercises & Burning
                                    Calories</p>
                            </div>
                            {renderButton()}
                        </div>
                    </div>
                </div>
            </div>
        </EnvWrapper>
    )
}

export default Home