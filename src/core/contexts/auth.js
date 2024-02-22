import React, {useCallback, useContext, useEffect, useReducer, useState} from "react"
import AuthService from "../services/auth"
import MFModal from "../../components/MFModal"
import {
    EVM_WALLETS,
    PROVIDER_NAME,
    SUPPORTED_NETWORKS,
    WALLET_CONNECT,
    WEB3_METHODS,
} from "../utils/constants/blockchain"
import {isMobileOrTablet} from "../utils/helpers/device"
import {useLocalStorage} from "../hooks/useLocalStorage"
import {getLocalStorage, LOCALSTORAGE_KEY, removeLocalStorage, setLocalStorage} from "../utils/helpers/storage"
import {detectProvider, getNFTBalance, getPersonalSignMessage, switchNetwork} from "../utils/helpers/blockchain"
import Web3 from "web3"
import WalletConnectProvider from "@walletconnect/web3-provider"
import WalletConnect from "@walletconnect/client"
import QRCodeModal from "@walletconnect/qrcode-modal"
import {COMMON_CONFIGS} from "../utils/configs/common"
import {jwtDecode} from "jwt-decode"
// import {CyberApp} from "@cyberlab/cyber-app-sdk"
import CryptoJS from "crypto-js"
import ConnectWalletModal from "../../components/ConnectWalletModal"
import ConnectSocialModal from "../../components/ConnectSocialModal"
import { connectWalletToAccountAPI } from "../services/connect-account"
import { getRedirectResult } from "firebase/auth"
import { auth } from "../utils/helpers/firebase"
import { useSearchParams } from "react-router-dom"

const {APP_URI, CYBER_ACCOUNT_KEY, MOON_BEAM_RPC} = COMMON_CONFIGS

const AuthContext = React.createContext()

const checkUserData = () => {
    const userData = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT))
    if (userData != null) {
        return userData
    } else {
        return {}
    }
}

const checkConnect = () => {
    const userData = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT))
    if (userData != null) {
        return true
    } else {
        return false
    }
}

const INIT_AUTH = {
    // authorized: false,
    user: checkUserData(),
    isConnected: checkConnect(),
}

function authReducer(state, action) {
    switch (action.type) {
        case "CONNECT":
            return {user: action.user, isConnected: action.isConnected}
        case "DISCONNECT":
            return {user: {}, isConnected: false}
        default:
            return state
    }
}

const checkListUsers = () => {
    const userData = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT))
    if (userData != null) {
        if (userData?.appUser?.length === 0) {
            return {success: false, message: "", data: [], account: userData.account}
        } else {
            return {success: true, message: "", data: userData.appUser, account: userData.account}
        }
    } else {
        return {success: true, message: "", data: [], account: ""}
    }
}

const checkSignature = () => {
    const userData = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT))

    const data = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))

    // if (userData != null && data && userData.account.toLowerCase() === data.account.toLowerCase()) {
    //     return true
    // } else {
    //     return false
    // }
    if (userData !== null && data !==null) {
        return true
    } else {
        return false
    }
}

const checkSignatureData = () => {
    const userData = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT))
    const data = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))
    // if (userData != null && data && userData.account.toLowerCase() === data.account.toLowerCase()) {
    //     return data.signature
    // } else {
    //     return {}
    // }
    if (userData !== null && data !==null) {
        return data.signature
    } else {
        return {}
    }
}

const checkIsLoginSocial = () => {
    const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    if (accessToken !== null) {
        return true
    } else {
        return false
    }
}

const AuthProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, INIT_AUTH)
    const [isConnectModalVisible, setIsConnectModalVisible] = useState(false)
    const [isSwitchWalletModalVisible, setIsSwitchWalletModalVisible] = useState(false)
    const [walletExtKey, setWalletExtKey] = useLocalStorage(LOCALSTORAGE_KEY.WALLET_EXT)
    const [provider, setProvider] = useState(null)
    const [, setNetWork] = useLocalStorage(LOCALSTORAGE_KEY.NETWORK)
    const isMetaMaskBrowser = isMobileOrTablet() && !!window[PROVIDER_NAME.MetaMask]
    const [connector, setConnector] = useState(null)
    const [isSignature, seIsSignature] = useState(checkSignature())
    const [signatureData, setSignatureData] = useState(checkSignatureData)
    // const [listUsers, setListUsers] = useState({success: true, message: "", data: [],account:""})
    const [listUsers, setListUsers] = useState(checkListUsers())
    const [chooseUserData, setChooseUserData] = useState({})
    const [connectToCyber, setConnectToCyber] = useState({isConnected: false, address: "", ownerAddress: ""})
    const [app, setApp] = useState()
    const [isOpenModalChooseAccount, setIsOpenModalChooseAccount] = useState(false)
    const [isLoginSocial, setIsLoginSocial] = useState(checkIsLoginSocial())
    const [isOpenModalSocial,setIsOpenModalSocial]=useState(false)


    useEffect(() => {

        // getLoginSocialData()

        // function checkConnectedWallet() {
        //     const userData = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT))

        //     if (userData != null) {
        //         if (userData?.appUser?.length === 0) {
        //             setListUsers({...listUsers, success: false, account: userData.account})
        //         } else {
        //             setListUsers({...listUsers, data: userData.appUser, success: true, account: userData.account})
        //         }

        //         dispatch({type: "CONNECT", user: userData, isConnected: true})

        //         const data = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))

        //         if (data && userData.account === data.account.toLowerCase()) {
        //             seIsSignature(true)
        //             setSignatureData(data.signature)
        //         }
        //     }
        // }
        // checkConnectedWallet()

        // const checkRefreshToken = () => {
        //     const refreshToken = getLocalStorage(LOCALSTORAGE_KEY.REFRESH_TOKEN)
        //     if (refreshToken != null) {
        //         const decoded = jwtDecode(refreshToken)
        //         const exp = decoded.exp * 1000
        //         const now = Date.now()
        //         if (now > exp) {
        //             onDisconnect()
        //         }
        //     }
        // }
        // checkRefreshToken()

        /****
         * TODO: For debug
         */
        function getParameterByName(name, url = window.location.href) {
            // eslint-disable-next-line no-useless-escape
            name = name.replace(/[\[\]]/g, "\\$&")
            const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url)
            if (!results) return null
            if (!results[2]) return ""
            return decodeURIComponent(results[2].replace(/\+/g, " "))
        }

        const debug = getParameterByName("_debug")

        if (debug) {
            if (debug === "1") {
                localStorage.setItem("_debug", "1")
            } else {
                localStorage.removeItem("_debug")
            }
        }

        

        //Cyber Connect

        // const app = new CyberApp({
        //     appId: "fc2e27cd-065a-4de3-b76a-c41eb4663d1a", // required
        //     name: "Moonfit", // required
        //     icon: "https://d1fdloi71mui9q.cloudfront.net/J4eYUiAQSg6ltjF0IFGg_nwd3NOLCBd476tmF", // required
        // })
        // app.start().then((cyberAccount) => {
        //     if (cyberAccount) {
        //         console.log("here")
        //         setApp(app)
        //         setConnectToCyber({
        //             isConnected: true,
        //             address: cyberAccount.address,
        //             ownerAddress: cyberAccount.ownerAddress,
        //         })
        //         onDisconnect().then(() => {
        //             handleLoginInCyberApp(cyberAccount.ownerAddress)
        //         })
        //     } else {
        //         console.log("Failed to connect to CyberWallet")
        //     }
        // })
    }, [])

    // useEffect(() => {
    //     const getUserData = async () => {
    //         if (chooseUserData.user) {
    //             // const provider = await detectProvider(walletExtKey)
    //             const web3 = new Web3(MOON_BEAM_RPC)
    //             // const walletAccount = await web3.eth.getAccounts()
    //             // const account = walletAccount[0]
    //             const account = chooseUserData?.user?.wallet_address
    //             const {access_token: jwt, refresh_token} = chooseUserData
    //             const users = listUsers?.data
    //             const user = chooseUserData.user
    //             // Get on-chain information
    //             const currentBalance = await web3.eth.getBalance(account) // Get wallets balance
    //             const ethBalance = web3.utils.fromWei(currentBalance, "ether")
    //             // const chainId = await provider.request({method: "eth_chainId"})
    //             // const nChainId = web3.utils.hexToNumber(chainId)
    //             const nChainId = 1287
    //             const network = SUPPORTED_NETWORKS.filter((chain) => chain.chain_id === nChainId)[0]
    //             const nftBalance = await getNFTBalance(network.rpc_url, account)
    //             user.isHolder = nftBalance.total > 0
    //             const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
    //             if (accessToken !== null) {
    //                 saveWalletInfo(users, currentBalance, ethBalance, account, nChainId, nftBalance, accessToken)
    //             } else {
    //                 saveWalletInfo(users, currentBalance, ethBalance, account, nChainId, nftBalance, jwt)
    //             }
    //             setNetWork(network)
    //         }
    //     }
    //     getUserData()
    // }, [chooseUserData])

 

    const hideConnectModal = () => setIsConnectModalVisible(false)

    const onWalletSelect = async (wallet) => {
        const providerName = wallet.extensionName
        const isInstalled = window[providerName] && window[providerName][wallet.isSetGlobalString]
        if (isMobileOrTablet() && !isMetaMaskBrowser) {
            let deepLink = `dapp://${APP_URI}`
            if (providerName === "SubWallet") {
                deepLink = `subwallet://browser?url=${APP_URI}`
            }
            return (window.location.href = deepLink)
        }
        if (!isInstalled && wallet.needInstall) return window.open(wallet.installUrl)
        setWalletExtKey(providerName)
        await onConnect(providerName)
        if(isLoginSocial){
            await connectWalletToAccountAPI()
        }
        document.body.classList.remove("toggle-menu")
        hideConnectModal()
        // setIsOpenModalChooseAccount(true)
        return true
    }

    const onConnectViaSubWallet = async () => {
        setWalletExtKey(PROVIDER_NAME.SubWallet)
        return await onConnect(PROVIDER_NAME.SubWallet)
    }

    const onAuthorizeNewWallet = async () => {
        const provider = await detectProvider(walletExtKey)
        await provider.request(WEB3_METHODS.requestPermissions)
        setIsSwitchWalletModalVisible(false)
        await retrieveCurrentWalletInfo(provider)
    }

    const saveWalletInfo = useCallback((user, currentBalance, ethBalance, account, chainId, nftBalance) => {
        const walletAccount = {
            appUser: user,
            account: account,
            balance: ethBalance,
            currentBalance,
            chainId: chainId,
            nftBalance,
        }
        setLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT, JSON.stringify(walletAccount)) // user persisted data
        // setLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN, jwt) // user persisted data
        const userData = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT))
        dispatch({type: "CONNECT", user: userData, isConnected: true})
    }, [])



    const retrieveCurrentWalletInfo = useCallback(
        async (provider) => {
            try {
                const web3 = new Web3(provider)
                const walletAccount = await web3.eth.getAccounts()
                const account = walletAccount[0]

                const res = await handleLogin(provider, account)

                if (res) {
                    const {data: dataD, signData,success} = res

                    // const {success} = dataD

                    if (success) {
                        const user = []
                        const jwt = ""
                        // Get on-chain information
                        const currentBalance = await web3.eth.getBalance(account) // Get wallets balance
                        const ethBalance = web3.utils.fromWei(currentBalance, "ether")
                        const chainId = await provider.request({method: "eth_chainId"})

                        const nChainId = web3.utils.hexToNumber(chainId)

                        const network = SUPPORTED_NETWORKS.filter((chain) => chain.chain_id === nChainId)[0]
                        const nftBalance = await getNFTBalance(network.rpc_url, account)
                        // user.isHolder = nftBalance.total > 0
                        setNetWork(network)
                        saveWalletInfo(user, currentBalance, ethBalance, account, nChainId, nftBalance, jwt)
                        // setListUsers({
                        //     success: dataD.success,
                        //     message: dataD.message,
                        //     account: account,
                        //     data: dataD.data.users,
                        // })
                    } else {
                        const user = []
                        const jwt = ""
                        const currentBalance = await web3.eth.getBalance(account) // Get wallets balance
                        const ethBalance = web3.utils.fromWei(currentBalance, "ether")
                        const chainId = await provider.request({method: "eth_chainId"})
                        const nChainId = web3.utils.hexToNumber(chainId)
                        const network = SUPPORTED_NETWORKS.filter((chain) => chain.chain_id === nChainId)[0]
                        const nftBalance = await getNFTBalance(network.rpc_url, account)

                        // const value = {
                        //     success: dataD.success,
                        //     message: dataD.message,
                        //     account: account,
                        // }
                        setNetWork(network)
                        saveWalletInfo(user, currentBalance, ethBalance, account, nChainId, nftBalance, jwt)
                        // setListUsers(value)
                    }
                    return signData
                }
            } catch (e) {
                console.error(e)
            }
        },
        [saveWalletInfo, setNetWork]
    )

    const handleWalletChange = useCallback(
        async (wallets) => {
            //     const account = state?.user?.account
            //     if (!account) return false
            //     const provider = await detectProvider(walletExtKey)
            //     if (!provider) {
            //         console.log("HandleWalletChange: SubWallet is not installed")
            //         return false
            //     }
            //     if (wallets.length === 0) return true
            //     else if (wallets.length === 1) {
            //         // console.log(wallets.account, wallets[0])
            //         setIsSwitchWalletModalVisible(false)
            //         account !== wallets[0] && await retrieveCurrentWalletInfo(provider)
            //     } else {
            //         setIsSwitchWalletModalVisible(true)
            //     }
        },
        [state.user, retrieveCurrentWalletInfo, detectProvider]
    )

    useEffect(() => {
        walletExtKey &&
            detectProvider(walletExtKey).then(async (provider) => {
                // await provider?.request(WEB3_METHODS.requestAccounts)

                setProvider(provider)
                // provider && provider?.on('accountsChanged', handleWalletChange)
                // provider?.on('chainChanged', () => {
                //     console.log('chainChanged')
                // })
            })
        // return () => provider?.removeListener('accountsChanged', handleWalletChange)
    }, [walletExtKey, handleWalletChange])

    useEffect(() => {
        walletExtKey &&
            detectProvider(walletExtKey).then(async (provider) => {
                await provider?.request(WEB3_METHODS.requestAccounts)
                setProvider(provider)
                provider && provider?.on("accountsChanged", handleWalletChange)
                // provider?.on('chainChanged', () => {
                //     console.log('chainChanged')
                // })
            })
        return () => provider?.removeListener("accountsChanged", handleWalletChange)
    }, [provider, walletExtKey, detectProvider, handleWalletChange])

    const onConnect = async (providerNameParam = null) => {
        try {
            let provider
            if (providerNameParam === "walletConnect") {
                provider = new WalletConnectProvider({
                    rpc: {
                        1287: "https://rpc.api.moonbase.moonbeam.network",
                        // 1287: "https://rpc.ankr.com/moonbeam",
                    },
                })
                await provider.enable()
            } else {
                provider = await detectProvider(providerNameParam || walletExtKey)
                if (!provider) {
                    console.log("Wallet extension is not installed")
                    return
                }
                setProvider(provider)
                await provider.request({method: "eth_requestAccounts"})
            }
            // setProvider(provider)
            await provider.request({method: "eth_requestAccounts"})

            await switchNetwork(provider)
            return await retrieveCurrentWalletInfo(provider)
        } catch (err) {
            console.log(
                "There was an error fetching your accounts. Make sure your SubWallet or MetaMask is configured correctly.",
                err
            )
        }
    }

    useEffect(() => {
        try {
            const connectWC = async (chainId, connectedAccount) => {
                const networkData = SUPPORTED_NETWORKS.filter((chain) => chain.chain_id === chainId)[0]

                if (networkData) {
                    const signMessage = `MoonFit:${connectedAccount}:${new Date().getTime()}`
                    const msgParams = [getPersonalSignMessage(signMessage), connectedAccount]
                    const signature = await connector.signPersonalMessage(msgParams)
                    const signData = {
                        moon_fit_msg: signMessage,
                        signature,
                    }
                    const reqData = {
                        wallet_address: connectedAccount,
                        ...signData,
                    }
                    // const {data} = await AuthService.login(reqData)
                    // const {user, jwt, users} = data
                    const user=[]
                    setNetWork(networkData)
                    const web3 = new Web3(networkData.rpc_url)

                    const currentBalance = await web3.eth.getBalance(connectedAccount) // Get wallets balance
                    const ethBalance = web3.utils.fromWei(currentBalance, "ether")
                    const network = SUPPORTED_NETWORKS.filter((chain) => chain.chain_id === chainId)[0]
                    const nftBalance = await getNFTBalance(network.rpc_url, connectedAccount)
                    user.isHolder = nftBalance.total > 0
                    setNetWork(network)
                    saveWalletInfo(user, currentBalance, ethBalance, connectedAccount, chainId, nftBalance, jwt)
                }
            }

            if (connector) {
                connector.on("connect", async (error, payload) => {
                    const {chainId, accounts} = payload.params[0]
                    await connectWC(chainId, accounts[0])
                    setIsConnectModalVisible(false)
                })

                connector.on("disconnect", async (error, payload) => {
                    if (error) {
                        throw error
                    }
                    await onDisconnect()
                })
            }
        } catch (e) {
            console.error(e)
        }
    }, [connector])
    useEffect(() => {
        const wc = getLocalStorage(LOCALSTORAGE_KEY.WC_CONNECTOR, null)
        if (wc && isMobileOrTablet()) {
            const connector = new WalletConnect({session: JSON.parse(wc)})
            setConnector(connector)
        }
    }, [])

    const handleToggleConnect=(type,address)=>{
        if(type==="CONNECT"){
            const userData={
                account:address,
            }
            dispatch({type: type,isConnected: true,user:userData})

        }else{
            dispatch({type: type})

        }
    }

    const onWCConnect = async () => {
        const connector = new WalletConnect({
            bridge: "https://bridge.walletconnect.org",
            qrcodeModal: QRCodeModal,
            storageId: LOCALSTORAGE_KEY.WC_CONNECTOR,
            qrcodeModalOptions: {desktopLinks: []},
        })
        setConnector(connector)

        if (connector.connected) {
            await connector.killSession()
        }
        // check if already connected
        if (!connector.connected) {
            // create new session
            await connector.createSession()
        }
    }

    const onDisconnect = async (callback = null) => {
        if (connector?.connected) {
            await connector.killSession()
            removeLocalStorage(LOCALSTORAGE_KEY.WC_CONNECTOR)
        }
        removeLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT)
        removeLocalStorage(LOCALSTORAGE_KEY.NETWORK)
   
        removeLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE)
    
        removeLocalStorage(LOCALSTORAGE_KEY.SELECTED_USER_ID)
        removeLocalStorage(LOCALSTORAGE_KEY.SELECTED_NETWORK)
        setWalletExtKey(null)
        seIsSignature(false)
        setSignatureData({})
        dispatch({type: "DISCONNECT"})
        callback && callback()
    }

    const handleLogin = async (provider, account, text = null) => {
        if (text === "reCall") {
            try {
                // const signMessage = `MoonFit:${account}:${new Date().getTime()}`
                // const signature = await provider.request({
                //     method: "personal_sign",
                //     params: [getPersonalSignMessage(signMessage), account],
                // })
                // // const signData = {
                // //     moon_fit_msg: signMessage,
                // //     signature
                // // }
                const walletSignature = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))
                const messageReq = walletSignature.signature
                const account = walletSignature.account
                // const signData = {
                //     message: signMessage,
                //     signature,
                // }

                const signDatav2 = messageReq
                const reqData = messageReq
                // const {data, success, message} = await AuthService.login(reqData)
                // // seIsSignature(true)
                // // setSignatureData(signDatav2)
                // // setLocalStorage(
                // //     LOCALSTORAGE_KEY.WALLET_SIGNATURE,
                // //     JSON.stringify({
                // //         account,
                // //         signature: reqData,
                // //     })
                // // )
                // setListUsers({
                //     success: data.success,
                //     message: data.message,
                //     account: account,
                //     data: data?.data?.users || [],
                // })
                // return {data, success, message, signData}
            } catch (e) {
                console.error(e)
                // alert(`Cannot login: ${e.message}`)
            }
        } else {
            try {
                const signMessage = `MoonFit:${account}:${new Date().getTime()}`
                const signature = await provider.request({
                    method: "personal_sign",
                    params: [getPersonalSignMessage(signMessage), account],
                })
                // const signData = {
                //     moon_fit_msg: signMessage,
                //     signature
                // }
                const signData = {
                    message: signMessage,
                    signature,
                }

                const signDatav2 = {
                    message: signMessage,
                    signature,
                    wallet_address: account,
                }
                const reqData = {
                    wallet_address: account,
                    ...signData,
                }

                // const {data, success, message} = await AuthService.login(reqData)
                const data={}
                const message=""
                const success=true
                seIsSignature(true)
                setSignatureData(signDatav2)
                setLocalStorage(
                    LOCALSTORAGE_KEY.WALLET_SIGNATURE,
                    JSON.stringify({
                        account,
                        signature: reqData,
                    })
                )
                return {data, success, message, signData}
            } catch (e) {
                console.error(e)
                // alert(`Cannot login: ${e.message}`)
            }
        }
    }

    const handleLoginInCyberApp = async (address) => {
        try {
            const value = {
                wallet_address: address,
                time: Date.now(),
            }

            const key = CryptoJS.AES.encrypt(JSON.stringify(value), CYBER_ACCOUNT_KEY).toString()
            const reqData = {
                key,
                wallet_address: address,
            }
            const {data} = await AuthService.loginInCyberApp(reqData)
            seIsSignature(true)
            setSignatureData(reqData)
            setLocalStorage(
                LOCALSTORAGE_KEY.WALLET_SIGNATURE,
                JSON.stringify({
                    account: address,
                    signature: reqData,
                })
            )
            const {success} = data
            const web3 = new Web3(MOON_BEAM_RPC)
            if (success) {
                const provider = await detectProvider("ethereum")
                setProvider(provider)
                const user = data.data.users
                const jwt = ""
                // Get on-chain information
                const currentBalance = await web3.eth.getBalance(address) // Get wallets balance
                const ethBalance = web3.utils.fromWei(currentBalance, "ether")
                //  const chainId = await provider.request({method: "eth_chainId"})

                //  const nChainId = web3.utils.hexToNumber(chainId)
                const nChainId = 1287

                const network = SUPPORTED_NETWORKS.filter((chain) => chain.chain_id === nChainId)[0]

                const nftBalance = await getNFTBalance(network.rpc_url, address)
                // user.isHolder = nftBalance.total > 0
                setNetWork(network)
                saveWalletInfo(user, currentBalance, ethBalance, address, nChainId, nftBalance, jwt)
                setListUsers({
                    success: data.success,
                    message: data.message,
                    account: address,
                    data: data.data.users,
                })
            } else {
                const user = []
                const jwt = ""
                const currentBalance = await web3.eth.getBalance(address) // Get wallets balance
                const ethBalance = web3.utils.fromWei(currentBalance, "ether")
                //  const chainId = await provider.request({method: "eth_chainId"})
                const nChainId = 1287
                const network = SUPPORTED_NETWORKS.filter((chain) => chain.chain_id === nChainId)[0]
                const nftBalance = await getNFTBalance(network.rpc_url, address)

                const value = {
                    success: data.success,
                    message: data.message,
                    account: address,
                }
                setNetWork(network)
                saveWalletInfo(user, currentBalance, ethBalance, address, nChainId, nftBalance, jwt)
                setListUsers(value)
            }

            // return {data, success, message, signData}
        } catch (e) {
            console.error(e)
            // alert(`Cannot login: ${e.message}`)
        }
    }

    const handleLoginAfterChooseAccount = async (account, userId) => {
        try {
            const walletSignature = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))
            const signature = walletSignature.signature

            const reqData = {
                ...signature,
                user_id: userId,
            }

            const {data, success, message} = await AuthService.loginAfterChooseUser(reqData)
            seIsSignature(true)
            setSignatureData(reqData)
            setLocalStorage(
                LOCALSTORAGE_KEY.WALLET_SIGNATURE,
                JSON.stringify({
                    account,
                    signature: reqData,
                })
            )
            return {data, success, message}
        } catch (e) {
            console.error(e)
            // alert(`Cannot login: ${e.message}`)
        }
    }

    const handleLoginAfterChooseAccountCyberApp = async (account, userId) => {
        try {
            const walletSignature = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))
            const signature = walletSignature.signature

            const reqData = {
                ...signature,
                user_id: userId,
            }

            const {data, success, message} = await AuthService.loginAfterChooseUserCyberApp(reqData)
            seIsSignature(true)
            setSignatureData(reqData)
            setLocalStorage(
                LOCALSTORAGE_KEY.WALLET_SIGNATURE,
                JSON.stringify({
                    account,
                    signature: reqData,
                })
            )
            return {data, success, message}
        } catch (e) {
            console.error(e)
            // alert(`Cannot login: ${e.message}`)
        }
    }

    const sendViaCyberWallet = async (data) => {
        const hash = await app?.cyberWallet?.baseGoerli.sendTransaction(
            {
                to: data.transaction.to,
                value: data.transaction.value,
                data: data.transaction.data,
            },
            {description: "Sign in Cyber"}
        )
        return hash
    }

    const handleGetAccessToken = async (account, userId) => {
        const refreshToken = getLocalStorage(LOCALSTORAGE_KEY.REFRESH_TOKEN)
        const reqData = {
            refresh_token: refreshToken,
            wallet_address: account,
            user_id: userId,
        }
        seIsSignature(true)
        const res = await AuthService.getAccessToken(reqData)
        return res
    }

    const onAuthorizeMoreWallet = async () => {
        const provider = await detectProvider(walletExtKey)
        await provider.request(WEB3_METHODS.requestPermissions)
        await retrieveCurrentWalletInfo(provider)
    }

    const context = {
        auth: state,
        walletExtKey,
        showConnectModal: () => setIsConnectModalVisible(true),
        onDisconnect,
        onAuthorizeMoreWallet,
        onConnectViaSubWallet,
        provider,
        isSignature,
        signatureData,
        connector,
        listUsers,
        handleLogin,
        handleLoginAfterChooseAccount,
        handleLoginAfterChooseAccountCyberApp,
        setChooseUserData,
        handleGetAccessToken,
        connectToCyber,
        sendViaCyberWallet,
        isOpenModalChooseAccount,
        setIsOpenModalChooseAccount,
        isLoginSocial,
        setIsLoginSocial,
        setIsOpenModalSocial,
        handleToggleConnect,
      
    }

    return (
        <AuthContext.Provider value={context}>
            {children}

            <ConnectWalletModal 
            isOpen={isConnectModalVisible} 
            onClose={()=>{
                setIsConnectModalVisible(false)
            }}
            setIsConnectModalVisible={setIsConnectModalVisible}
            setIsOpenModalSocial={setIsOpenModalSocial}
            onWalletSelect={onWalletSelect}
            isLoginSocial={isLoginSocial}
    
            />
            <ConnectSocialModal isOpen={isOpenModalSocial} onClose={setIsOpenModalSocial}/>
            {/* <MFModal
                title={"Connect Wallet"}
                visible={isConnectModalVisible}
                centered={true}
                onCancel={() => setIsConnectModalVisible(false)}
                footer={false}
            >
                {EVM_WALLETS.map((wallet, index) => {
                    const isInstalled =
                        window[wallet.extensionName] && window[wallet.extensionName][wallet.isSetGlobalString]
                    const onClick = (e) => {
                        e.preventDefault()
                        window.open(wallet.installUrl)
                    }
                    const isVisible = isMobileOrTablet() ? wallet.isMobileSupport : true
                    return (
                        isVisible && (
                            <div key={index} className={"evm-wallet-item"} onClick={() => onWalletSelect(wallet)}>
                                <div className={"wallet-logo"}>
                                    <img src={wallet.logo.src} alt={wallet.logo.alt} width={40} />
                                </div>
                                <div className="wallet-title">{wallet.title}</div>
                                {!isInstalled && wallet.needInstall && !isMobileOrTablet() && (
                                    <div className="wallet-install-btn h-link" onClick={onClick}>
                                        Install
                                    </div>
                                )}
                            </div>
                        )
                    )
                })}
                {
                    <div className={"evm-wallet-item"} onClick={onWCConnect}>
                        <div className={"wallet-logo"}>
                            <img src={WALLET_CONNECT.logo.src} alt={WALLET_CONNECT.logo.alt} width={40} />
                        </div>
                        <div className="wallet-title">{WALLET_CONNECT.title}</div>
                    </div>
                }
            </MFModal>
            <MFModal
                title={"Unauthorized Wallet"}
                visible={isSwitchWalletModalVisible}
                centered={true}
                onCancel={() => setIsSwitchWalletModalVisible(false)}
                footer={[
                    <div className={"flex flex-col"} key="unauthorized-wallet-modal-footer">
                        <div className={"w-full"}>
                            <button
                                type="button"
                                onClick={onAuthorizeNewWallet}
                                className="w-full button button-primary"
                            >
                                Yes, let me authorize
                            </button>
                        </div>
                        <div className={"w-full mt-3"}>
                            <button
                                type="button"
                                onClick={() => setIsSwitchWalletModalVisible(false)}
                                className="w-full button button-secondary"
                            >
                                No, I will switch to another one now
                            </button>
                        </div>
                    </div>,
                ]}
            >
                <div className={"normal-case text-xl"}>
                    Your current wallet is not authorized to connect to MoonFit WebApp. Do you want to authorize this
                    wallet now?
                </div>
            </MFModal> */}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext)

    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthProvider")
    }

    return context
}

export {AuthProvider, useAuth}

