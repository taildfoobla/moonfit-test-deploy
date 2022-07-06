import React, {useContext, useEffect} from 'react'
import promotionBg from "../assets/images/promoting-bg.jpg"
import mediumSatellite1 from "../assets/images/shapes/medium-satellite-1.png"
import mediumSatellite2 from "../assets/images/shapes/medium-satellite-2.png"
import kusamaV2 from "../assets/images/shapes/kusama-v2.png"
import polkadot from "../assets/images/shapes/polkadot-v2.png"
import tokenMFR from "../assets/images/token-mfr.png"
import tokenMFG from "../assets/images/shapes/token-mfg.png"
import connectSW from "../assets/images/connect-subwallet/connect.png"
import AuthContext from "../contexts/AuthContext"
import AppContext from "../contexts/AppContext"
import {getReactEnv} from "../utils/env"
import Paths from "../routes/Paths"
import {useHistory} from "react-router-dom"

const SUBWALLET_EXT_URL = getReactEnv('SUBWALLET_EXT')


const Home = (props) => {
    const {user, onConnect} = useContext(AuthContext)
    const {setLoading} = useContext(AppContext)
    const history = useHistory()

    useEffect(() => {
        setLoading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
        } else if (!user.account) {
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
                    <button type="button"
                            onClick={() => history.push(Paths.PrivateSale)}
                            className="button button-primary">MFG Private Sale
                    </button>
                    <button type="button"
                            onClick={() => history.push(Paths.MintPassMinting)}
                            className="button button-secondary">Mint Pass
                    </button>
                </div>
            )
        }
    }

    return (
        <div className="section page-mint-pass">
            <div className="section-shape section-shape-promoting-bg">
                <img loading="lazy" src={promotionBg} alt="Promoting an active lifestyle"
                     width="1920"
                     height="340"/>
            </div>
            <div className="section-shape section-shape-satellite-1">
                <img loading="lazy" src={mediumSatellite1} alt="satellite"
                     width="229" height="224"/>
            </div>
            <div className="section-shape section-shape-satellite-2">
                <img loading="lazy" src={mediumSatellite2} alt="satellite"
                     width="407" height="490"/>
            </div>
            <div className="section-shape section-shape-kusama move-vertical">
                <img loading="lazy" src={kusamaV2} alt="Kusama" width="238"
                     height="237"/>
            </div>
            <div className="section-shape section-shape-polkadot move-vertical-reversed">
                <img loading="lazy" src={polkadot} alt="Polkadot" width="218"
                     height="223"/>
            </div>
            <div className="section-shape shape-token-mfr-1 move-vertical-reversed">
                <img loading="lazy" src={tokenMFR} alt="shape"
                     width="70"
                     height="70"/>
            </div>
            <div className="section-shape shape-token-mfr-2">
                <img loading="lazy" src={tokenMFR} alt="shape" className="move-vertical"
                     width="70"
                     height="70"/>
            </div>
            <div className="section-shape shape-token-mfg-1">
                <img loading="lazy" src={tokenMFG} alt="shape" width="71"
                     height="51" className="move-vertical-reversed"/>
            </div>
            <div className="section-shape shape-token-mfg-2">
                <img loading="lazy" src={tokenMFG} alt="shape"
                     width="70"
                     height="70" className="move-vertical-reversed"/>
            </div>
            <div className="section-content">
                <div className="container">
                    <div className="flex justify-center connect-image">
                        <img loading="lazy" src={connectSW}
                             alt="Moonfit + Subwallet"
                             width="659" height="94"/>
                    </div>
                    <h1 className="section-title">Token <br/><span className="secondary-color">Sale Event</span>
                    </h1>
                    <div className="section-description-wrap">
                        <p className="section-description">Please connect with SubWallet to join our token sale
                            events.</p>
                    </div>
                    {renderButton()}
                </div>
            </div>
        </div>
    )
}

export default Home