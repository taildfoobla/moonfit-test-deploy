import {useEffect, useState} from 'react'
import Web3 from 'web3'
import {renderRoutes} from "react-router-config"
import AuthContext from "./contexts/AuthContext"
import AppContext from "./contexts/AppContext"
import WebNavigation from "./components/shared/WebNavigation"
import WebFooter from "./components/shared/WebFooter"
import {WEB3_METHODS} from "./constants/blockchain"
import LoadingWrapper from "./components/shared/LoadingWrapper"


const App = ({route}) => {
    const [isConnected, setIsConnected] = useState(false)
    const [userInfo, setUserInfo] = useState({})
    const [loading, setLoading] = useState(true)

    // const history = useHistory()

    useEffect(() => {
        function checkConnectedWallet() {
            const userData = JSON.parse(localStorage.getItem('userAccount'))
            if (userData != null) {
                setUserInfo(userData)
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
            const userAccount = await web3.eth.getAccounts()
            const account = userAccount[0]
            let ethBalance = await web3.eth.getBalance(account) // Get wallet balance
            ethBalance = web3.utils.fromWei(ethBalance, 'ether') //Convert balance to wei
            saveUserInfo(ethBalance, account, chainId)
        } catch (err) {
            console.log(
                'There was an error fetching your accounts. Make sure your SubWallet is configured correctly.'
            )
        }
    }

    const onDisconnect = (callback = null) => {
        window.localStorage.removeItem('userAccount')
        setUserInfo({})
        setIsConnected(false)
        callback && callback()
    }

    const saveUserInfo = (ethBalance, account, chainId) => {
        const userAccount = {
            account: account,
            balance: ethBalance,
            chainId: chainId,
        }
        window.localStorage.setItem('userAccount', JSON.stringify(userAccount)) // user persisted data
        const userData = JSON.parse(localStorage.getItem('userAccount'))
        setUserInfo(userData)
        setIsConnected(true)
    }


    return (
        <AppContext.Provider value={{loading, setLoading}}>
            <AuthContext.Provider value={{user: userInfo, setUserInfo, onConnect, onDisconnect}}>
                <div tabIndex="0" className="page-connect-subwallet">
                    <div className="section-effect-snow site-effect-snow" data-firefly-total="50"></div>
                    <WebNavigation isConnected={isConnected}/>
                    <div id="main-content" className="main-content">
                        {renderRoutes(route.routes)}
                        {loading && <LoadingWrapper/>}
                    </div>
                    <WebFooter/>
                </div>
            </AuthContext.Provider>
        </AppContext.Provider>
    )
}

export default App
