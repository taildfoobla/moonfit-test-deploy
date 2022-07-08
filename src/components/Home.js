import React, {useContext, useEffect} from 'react'
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
        <div className="page-home">
            <div className="section">
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
        </div>
    )
}

export default Home