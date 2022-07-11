import React, {useEffect, useState} from 'react'
import Web3 from 'web3'
import {renderRoutes} from "react-router-config"
import WalletAuthContext from "./contexts/WalletAuthContext"
import AppContext from "./contexts/AppContext"
import WebNavigation from "./components/shared/WebNavigation"
import WebFooter from "./components/shared/WebFooter"
import {WEB3_METHODS} from "./constants/blockchain"
import LoadingWrapper from "./components/shared/LoadingWrapper"
import promotionBg from "./assets/images/promoting-bg.jpg"
import mediumSatellite1 from "./assets/images/shapes/medium-satellite-1.png"
import mediumSatellite2 from "./assets/images/shapes/medium-satellite-2.png"
import kusamaV2 from "./assets/images/shapes/kusama-v2.png"
import polkadot from "./assets/images/shapes/polkadot-v2.png"
import tokenMFR from "./assets/images/token-mfr.png"
import tokenMFG from "./assets/images/shapes/token-mfg.png"


const App = ({route}) => {
    const [isConnected, setIsConnected] = useState(false)
    const [wallet, setWallet] = useState({})
    const [loading, setLoading] = useState(true)

    // const history = useHistory()

    useEffect(() => {
        function checkConnectedWallet() {
            const userData = JSON.parse(localStorage.getItem('walletAccount'))
            if (userData != null) {
                setWallet(userData)
                setIsConnected(true)
            }
        }

        checkConnectedWallet()
    }, [])

    const onConnect = async () => {
        try {
            const provider = window.SubWallet
            if (!provider) {
                console.log('SubWallet is not installed')
            }
            await provider.request({method: 'eth_requestAccounts'})
            const chainId = await provider.request({method: 'eth_chainId'})

            await provider.request(WEB3_METHODS.switchToMoonbaseAlphaNetwork)
            // if (!chainId || chainId.toString() !== MOONBEAM_CHAIN_ID.toString()) {
            //     console.log("Not Moonbeam Network")
            //     try {
            //         await provider.request(WEB3_METHODS.switchToMoonbeamNetwork)
            //     } catch (e) {
            //         console.log("Cannot switchToMoonbeamNetwork: ", e.message)
            //         await provider.request(WEB3_METHODS.addMoonbeamNetwork)
            //     }
            // }

            const web3 = new Web3(provider)
            const walletAccount = await web3.eth.getAccounts()
            const account = walletAccount[0]
            let ethBalance = await web3.eth.getBalance(account) // Get wallet balance
            ethBalance = web3.utils.fromWei(ethBalance, 'ether') //Convert balance to wei
            saveWalletInfo(ethBalance, account, chainId)
        } catch (err) {
            console.log(
                'There was an error fetching your accounts. Make sure your SubWallet is configured correctly.'
            )
        }
    }

    const onDisconnect = (callback = null) => {
        window.localStorage.removeItem('walletAccount')
        setWallet({})
        setIsConnected(false)
        callback && callback()
    }

    const saveWalletInfo = (ethBalance, account, chainId) => {
        const walletAccount = {
            account: account,
            balance: ethBalance,
            chainId: chainId,
        }
        window.localStorage.setItem('walletAccount', JSON.stringify(walletAccount)) // user persisted data
        const userData = JSON.parse(localStorage.getItem('walletAccount'))
        setWallet(userData)
        setIsConnected(true)
    }


    return (
        <AppContext.Provider value={{loading, setLoading}}>
            <WalletAuthContext.Provider value={{wallet, setWallet, onConnect, onDisconnect}}>
                <div tabIndex="0" className="page-connect-subwallet">
                    <div className="section-effect-snow site-effect-snow" data-firefly-total="50"></div>
                    <WebNavigation isConnected={isConnected}/>
                    <div id="main-content" className="main-content page-content">
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
                        <div className={'page-container'}>
                            {renderRoutes(route.routes)}
                            {loading && <LoadingWrapper/>}
                        </div>
                    </div>
                    <WebFooter/>
                </div>
            </WalletAuthContext.Provider>
        </AppContext.Provider>
    )
}

export default App
