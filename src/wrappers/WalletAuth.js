import React, { useCallback, useEffect, useState } from 'react'
import WalletAuthContext from "../contexts/WalletAuthContext"
import { switchNetwork } from "../utils/blockchain"
import Web3 from "web3"
import { getLocalStorage, LOCALSTORAGE_KEY, removeLocalStorage, setLocalStorage } from "../utils/storage"
import { EVM_WALLETS, PROVIDER_NAME, SUPPORTED_NETWORKS, WALLET_CONNECT, WEB3_METHODS, getPersonalSignMessage } from "../constants/blockchain"
import { Modal } from "antd"
import CloseIcon from "../components/shared/CloseIcon"
import { useLocalStorage } from "../hooks/useLocalStorage"
import { isMobileOrTablet } from "../utils/device"
import WalletConnect from "@walletconnect/client"
import QRCodeModal from "@walletconnect/qrcode-modal"
import { useLocation } from "react-router-dom"

const providerReadyEvent = {
    'ethereum': 'ethereum#initialized', // Metamask ready event
    'SubWallet': 'subwallet#initialized' // SubWallet ready event
}

// const {APP_URI} = COMMON_CONFIGS
// const deepLink = `https://metamask.app.link/dapp/pancakeswap.finance/`
// const deepLink = `dapp://${APP_URI}`
// eslint-disable-next-line no-restricted-globals
let deepLink = `dapp://${location.host}`

const WalletAuthWrapper = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false)
    const [isSignature, seIsSignature] = useState(false)
    const [signatureData, setSignatureData] = useState({})
    const [wallet, setWallet] = useState({})
    // const [walletExtKey, setWalletExtKey] = useState(null)
    const [walletExtKey, setWalletExtKey] = useLocalStorage(LOCALSTORAGE_KEY.WALLET_EXT)
    const [provider, setProvider] = useState(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isAuthModalVisible, setIsAuthModalVisible] = useState(false)
    const [network, setNetWork] = useLocalStorage(LOCALSTORAGE_KEY.NETWORK)
    const { pathname } = useLocation()
    // use Wallet Connect
    const [connector, setConnector] = useState(null)

    const isMetaMaskBrowser = isMobileOrTablet() && !!window[PROVIDER_NAME.MetaMask]

    useEffect(() => {
        function checkConnectedWallet() {
            const userData = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT))
            if (userData != null) {
                setWallet(userData)
                setIsConnected(true)

                const data = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))

                if (data && userData.account === data.account) {
                    seIsSignature(true)
                    setSignatureData(data.signature)
                }
            }
        }

        checkConnectedWallet()

        /****
         * TODO: For debug
         */
        function getParameterByName(name, url = window.location.href) {
            // eslint-disable-next-line no-useless-escape
            name = name.replace(/[\[\]]/g, '\\$&');
            const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }

        const debug = getParameterByName('_debug')

        if (debug) {
            if (debug === '1') {
                localStorage.setItem('_debug', '1')
            } else {
                localStorage.removeItem('_debug')
            }
        }
    }, [])

    const detectProvider = useCallback((providerNameParam = null) => {
        const providerName = providerNameParam || walletExtKey
        return new Promise((resolve) => {
            if (window[providerName]) {
                resolve(window[providerName])
            } else {
                const timeout = setTimeout(() => {
                    resolve(window[providerName])
                }, 2000)

                window.addEventListener(providerReadyEvent[providerName] || 'ethereum#initialized', () => {
                    clearTimeout(timeout)
                    resolve(window[providerName])
                })
            }
        })
    }, [walletExtKey])

    const saveWalletInfo = useCallback((ethBalance, account, chainId) => {
        const walletAccount = {
            account: account,
            balance: ethBalance,
            chainId: chainId,
        }
        setLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT, JSON.stringify(walletAccount)) // user persisted data
        const userData = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT))
        setWallet(userData)
        setIsConnected(true)
    }, [])

    const retrieveCurrentWalletInfo = useCallback(async (provider) => {
        const web3 = new Web3(provider)
        const walletAccount = await web3.eth.getAccounts()
        const account = walletAccount[0]
        let ethBalance = await web3.eth.getBalance(account) // Get wallets balance
        ethBalance = web3.utils.fromWei(ethBalance, 'ether') //Convert balance to wei
        const chainId = await provider.request({ method: 'eth_chainId' })
        const nChainId = web3.utils.hexToNumber(chainId)
        const network = SUPPORTED_NETWORKS.filter(
            (chain) => chain.chain_id === nChainId
        )[0]
        setNetWork(network)
        saveWalletInfo(ethBalance, account, nChainId)
    }, [saveWalletInfo, setNetWork])

    const handleWalletChange = useCallback(async (wallets) => {
        if (!wallet.account) return false

        const provider = await detectProvider()
        if (!provider) {
            console.log("HandleWalletChange: SubWallet is not installed")
            return false
        }

        if (wallets.length === 0) return true
        else if (wallets.length === 1) {
            // console.log(wallets.account, wallets[0])
            setIsModalVisible(false)
            wallet.account !== wallets[0] && await retrieveCurrentWalletInfo(provider)
        } else {
            setIsModalVisible(true)
        }
    }, [wallet, retrieveCurrentWalletInfo, detectProvider])

    useEffect(() => {
        walletExtKey && detectProvider().then(async provider => {
            await provider?.request(WEB3_METHODS.requestAccounts)
            setProvider(provider)
            provider?.on('accountsChanged', handleWalletChange)
            // provider?.on('chainChanged', () => {
            //     console.log('chainChanged')
            // })
            // const response = await provider.request(WEB3_METHODS.getPermissions)
            // const accounts = response[0]?.caveats[0].value || []
            // console.log(accounts)
        })
        return () => provider?.removeListener('accountsChanged', handleWalletChange)
    }, [provider, walletExtKey, detectProvider, handleWalletChange])

    const onConnect = async (providerNameParam = null) => {
        try {
            const provider = await detectProvider(providerNameParam)
            if (!provider) {
                console.log('Wallet extension is not installed')
                return
            }
           
            const web3 = new Web3(provider)
            const walletAccount = await web3.eth.getAccounts()
            const account = walletAccount[0]
            await handleLogin(provider, account)
   
             setProvider(provider)
           
            await provider.request({ method: 'eth_requestAccounts' })
      
            await switchNetwork(provider)
    
            await retrieveCurrentWalletInfo(provider)
           
            // Go to Mint Pass page
            // history.push(Paths.MintPassMinting.path)
        } catch (err) {
            console.log(
                'There was an error fetching your accounts. Make sure your SubWallet or MetaMask is configured correctly.', err
            )
        }
    }

    const onDisconnect = async (callback = null) => {
        // WalletConnect Session
        if (connector?.connected) {
            await connector.killSession()
            removeLocalStorage(LOCALSTORAGE_KEY.WC_CONNECTOR)
        }

        removeLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT)
        removeLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE)
        removeLocalStorage(LOCALSTORAGE_KEY.NETWORK)
        setWalletExtKey(null)
        setWallet({})
        setIsConnected(false)
        setSignatureData({})
        seIsSignature(false)
        callback && callback()
    }

    const onAuthorizeNewWallet = async () => {
        const provider = await detectProvider()
        await provider.request(WEB3_METHODS.requestPermissions)
        setIsModalVisible(false)
        await retrieveCurrentWalletInfo(provider)
    }

    const onAuthorizeMoreWallet = async () => {
        const provider = await detectProvider()
        await provider.request(WEB3_METHODS.requestPermissions)
        await retrieveCurrentWalletInfo(provider)
    }

    const showConnectModal = () => setIsAuthModalVisible(true)

    const hideConnectModal = () => setIsAuthModalVisible(false)

    const onWalletSelect = async (wallet) => {
        console.log("connect")
        const providerName = wallet.extensionName
        const isInstalled = window[providerName] && window[providerName][wallet.isSetGlobalString]

        if (localStorage.getItem('_debug')) {
     
            alert(JSON.stringify({
                providerName: providerName,
                isSetGlobalString: wallet.isSetGlobalString,
                w: typeof window[providerName],
                isInstalled: isInstalled ? 'True' : 'False',
            }))
        }

        if (isMobileOrTablet() && !isMetaMaskBrowser) {
          
            if (providerName === "SubWallet") {
                deepLink = `subwallet://browser?url=${window.location.host}`
            }

            if (pathname && pathname.length !== 0)  {
                deepLink = `${deepLink}${pathname}`
            }

            return window.location.href = deepLink
        }

        if (!isInstalled) {
          
            return window.open(wallet.installUrl)
        }
 

        setWalletExtKey(providerName)
        
        await onConnect(providerName)
        console.log("here5")
        hideConnectModal()
        return true
    }

    const handleLogin = async (provider, account) => {
        try {
            const signMessage = `MoonFit:${account}:${new Date().getTime()}`
            const signature = await provider.request({
                method: 'personal_sign',
                params: [getPersonalSignMessage(signMessage), account]
            })
            const signData = {
                message: signMessage,
                signature,
                wallet_address: account,
            }

            seIsSignature(true)
            setSignatureData(signData)
            setLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE, JSON.stringify({
                account,
                signature: signData,
            }))
            // const { data, success, message } = await AuthService.login(reqData)
            // return { data, success, message, signData }
        } catch (e) {
            console.error(e)
            // alert(`Cannot login: ${e.message}`)
        }
    }

    useEffect(() => {
        const connectWC = async (chainId, connectedAccount) => {
            const networkData = SUPPORTED_NETWORKS.filter(
                (chain) => chain.chain_id === chainId
            )[0]

            if (networkData) {
                setNetWork(networkData)
                const web3 = new Web3(networkData.rpc_url)
                let ethBalance = await web3.eth.getBalance(connectedAccount) // Get wallets balance
                ethBalance = web3.utils.fromWei(ethBalance, 'ether')
                saveWalletInfo(ethBalance, connectedAccount, chainId)
            }
        }

        if (connector) {
            connector.on("connect", async (error, payload) => {
                const { chainId, accounts } = payload.params[0]
                // await connector.updateChain({
                //     chainId: 1287,
                //     networkId: 1287,
                //     rpcUrl: "https://rpc.api.moonbase.moonbeam.network",
                //     nativeCurrency: {
                //         name: "DEV",
                //         symbol: "DEV",
                //     },
                // })
                await connectWC(chainId, accounts[0])
                setIsAuthModalVisible(false)
                // setFetching(false);
            })

            connector.on("disconnect", async (error, payload) => {
                if (error) {
                    throw error
                }
                await onDisconnect()
            })
            //
            // if ((!chainId || !account || !balance) && connector.connected) {
            //     refreshData();
            // }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connector])

    useEffect(() => {
        const wc = getLocalStorage(LOCALSTORAGE_KEY.WC_CONNECTOR, null)
        if (wc && isMobileOrTablet()) {
            const connector = new WalletConnect({ session: JSON.parse(wc) })
            setConnector(connector)
        }
    }, [])

    // eslint-disable-next-line no-unused-vars
    const onWCConnect = async () => {
        // create new connector
        const connector = new WalletConnect({
            bridge: "https://bridge.walletconnect.org",
            qrcodeModal: QRCodeModal,
            storageId: LOCALSTORAGE_KEY.WC_CONNECTOR,
            qrcodeModalOptions: { desktopLinks: [] }
        })
        setConnector(connector)

        if (connector.connected) {
            await connector.killSession()
        }
        // check if already connected
        if (!connector.connected) {
            // create new session
            await connector.createSession()
            // window.location.href = connector.uri
        }
    }

    // const createRequest = (requestInstant) => {
    //     if (!provider && !connector) {
    //         // console.log("No provider or connector detected")
    //         throw new Error("No provider or connector detected")
    //     } else if (connector.connected) return connector.createInstantRequest(requestInstant)
    //     else return provider.request(requestInstant)
    // }

    // const getWalletProvider = (requestInstant) => {
    //     if (!provider && !connector) {
    //         // console.log("No provider or connector detected")
    //         throw new Error("No provider or connector detected")
    //     } else if (connector.connected) return connector.createInstantRequest(requestInstant)
    //     else return provider.request(requestInstant)
    // }

    return (
        <WalletAuthContext.Provider value={{
            wallet,
            network,
            setWallet,
            walletExtKey,
            onConnect,
            onDisconnect,
            isConnected,
            isSignature,
            signatureData,
            detectProvider,
            onAuthorizeMoreWallet,
            provider,
            connector,
            // createRequest,
            showWalletSelectModal: showConnectModal
        }}>
            {children}
            <Modal title={'Choose Wallet'}
                   open={isAuthModalVisible}
                onCancel={hideConnectModal}
                closeIcon={<CloseIcon />}
                wrapClassName={'mf-modal connect-modal'}
                className={'mf-modal-content connect-modal-content top-32 sm:top-36 md:top-48'}
                footer={false}
            >
                <div className={'evm-wallet'}>
                    {
                        // isMobileOrTablet() && !isMetaMaskBrowser && (
                            <div>
                                <div className={'evm-wallet-item'}
                                    onClick={onWCConnect}>
                                    <div className={"wallet-logo"}>
                                        <img src={WALLET_CONNECT.logo.src} alt={WALLET_CONNECT.logo.alt} width={40} />
                                    </div>
                                    <div className="wallet-title">{WALLET_CONNECT.title}</div>
                                </div>
                            </div>
                        // )
                    }
                    {
                        EVM_WALLETS.map((wallet, index) => {
                            const isInstalled = window[wallet.extensionName] && window[wallet.extensionName][wallet.isSetGlobalString]
                            const onClick = (e) => {
                                e.preventDefault()
                                window.open(wallet.installUrl)
                            }
                            const isVisible = isMobileOrTablet() ? wallet.isMobileSupport : true
                            return isVisible && (
                                <div key={index} className={'evm-wallet-item'}
                                    onClick={() => onWalletSelect(wallet)}>
                                    <div className={"wallet-logo"}>
                                        <img src={wallet.logo.src} alt={wallet.logo.alt} width={40} />
                                    </div>
                                    <div className="wallet-title">{wallet.title}</div>
                                    {
                                        !isInstalled && !isMobileOrTablet() && (
                                            <div className="wallet-install-btn text-green-500"
                                                onClick={onClick}>Install</div>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </Modal>
            {/* <Modal title="Unauthorized Wallet"
                   open={isModalVisible}
                closeIcon={(
                    <svg className={'cursor-pointer'} width="32" height="32" viewBox="0 0 32 32" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="1" width="30" height="30" rx="6" stroke="white" strokeOpacity="0.2"
                            strokeWidth="2" />
                        <path d="M21.0625 10.9375L10.9375 21.0625" stroke="white" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M21.0625 21.0625L10.9375 10.9375" stroke="white" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
                wrapClassName={'mf-modal unauthorized-wallets-modal z-[9999]'}
                className={'mf-modal-content unauthorized-wallets-modal-content'}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <div className={'flex flex-col'} key="unauthorized-wallet-modal-footer">
                        <div className={'w-full'}>
                            <button type="button"
                                onClick={onAuthorizeNewWallet}
                                className="w-full button button-primary">
                                Yes, let me authorize
                            </button>
                        </div>
                        <div className={'w-full mt-3'}>
                            <button type="button"
                                onClick={() => setIsModalVisible(false)}
                                className="w-full button button-secondary">
                                No, I will switch to another one now
                            </button>
                        </div>
                    </div>
                ]}>
                <div className={'normal-case text-xl'}>
                    Your current wallet is not authorized to connect to MoonFit WebApp. Do you want to authorize this
                    wallet now?
                </div>
            </Modal> */}
        </WalletAuthContext.Provider>
    )
}

export default WalletAuthWrapper
