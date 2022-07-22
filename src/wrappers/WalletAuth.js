import React, {useCallback, useEffect, useState} from 'react'
import WalletAuthContext from "../contexts/WalletAuthContext"
import {switchNetwork} from "../utils/blockchain"
import Web3 from "web3"
import {getLocalStorage, LOCALSTORAGE_KEY, removeLocalStorage, setLocalStorage} from "../utils/storage"
import {useHistory} from "react-router-dom"
import Paths from "../routes/Paths"
import {EVM_WALLETS, PROVIDER_NAME, WEB3_METHODS} from "../constants/blockchain"
import {Modal} from "antd"
import CloseIcon from "../components/shared/CloseIcon"
import {useLocalStorage} from "../hooks/useLocalStorage"
import {COMMON_CONFIGS} from "../configs/common"
import {isMobileOrTablet} from "../utils/device"

const {APP_URI} = COMMON_CONFIGS

const providerReadyEvent = {
    'ethereum': 'ethereum#initialized', // Metamask ready event
    'SubWallet': 'subwallet#initialized' // SubWallet ready event
}

// const deepLink = `https://metamask.app.link/dapp/pancakeswap.finance/`
const deepLink = `dapp://${APP_URI}`

const WalletAuthWrapper = ({children}) => {
    const [isConnected, setIsConnected] = useState(false)
    const [wallet, setWallet] = useState({})
    // const [walletExtKey, setWalletExtKey] = useState(null)
    const [walletExtKey, setWalletExtKey] = useLocalStorage(LOCALSTORAGE_KEY.WALLET_EXT)
    const [provider, setProvider] = useState(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isAuthModalVisible, setIsAuthModalVisible] = useState(false)

    const history = useHistory()

    const isMetaMaskBrowser = isMobileOrTablet() && !!window[PROVIDER_NAME.MetaMask]

    useEffect(() => {
        function checkConnectedWallet() {
            const userData = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT))
            if (userData != null) {
                // console.log(userData)
                setWallet(userData)
                setIsConnected(true)
            }
        }

        checkConnectedWallet()
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
        const chainId = await provider.request({method: 'eth_chainId'})
        saveWalletInfo(ethBalance, account, chainId)
    }, [saveWalletInfo])

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
            await provider?.enable()
            setProvider(provider)
            // console.log(provider)
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
            await provider.request({method: 'eth_requestAccounts'})
            await switchNetwork(provider)
            await retrieveCurrentWalletInfo(provider)

            // Go to Mint Pass page
            history.push(Paths.MintPassMinting.path)
        } catch (err) {
            console.log(
                'There was an error fetching your accounts. Make sure your SubWallet or MetaMask is configured correctly.', err
            )
        }
    }

    const onDisconnect = (callback = null) => {
        removeLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT)
        setWalletExtKey(null)
        setWallet({})
        setIsConnected(false)
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
        const providerName = wallet.extensionName
        const isInstalled = window[providerName] && window[providerName][wallet.isSetGlobalString]
        if (isMobileOrTablet() && !isMetaMaskBrowser) {
            return window.location.href = deepLink
        }
        if (!isInstalled) return window.open(wallet.installUrl)
        setWalletExtKey(providerName)
        await onConnect(providerName)
        hideConnectModal()
        return true
    }

    return (
        <WalletAuthContext.Provider value={{
            wallet,
            setWallet,
            walletExtKey,
            onConnect,
            onDisconnect,
            isConnected,
            detectProvider,
            onAuthorizeMoreWallet,
            showWalletSelectModal: showConnectModal
        }}>
            {children}
            <Modal title={'Choose Wallet'}
                   visible={isAuthModalVisible}
                   onCancel={hideConnectModal}
                   closeIcon={<CloseIcon/>}
                   wrapClassName={'mf-modal connect-modal'}
                   className={'mf-modal-content connect-modal-content'}
                   footer={false}
            >
                <div className={'evm-wallet'}>
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
                                        <img src={wallet.logo.src} alt={wallet.logo.alt} width={40}/>
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
            <Modal title="Unauthorized Wallet"
                   visible={isModalVisible}
                   closeIcon={(
                       <svg className={'cursor-pointer'} width="32" height="32" viewBox="0 0 32 32" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                           <rect x="1" y="1" width="30" height="30" rx="6" stroke="white" strokeOpacity="0.2"
                                 strokeWidth="2"/>
                           <path d="M21.0625 10.9375L10.9375 21.0625" stroke="white" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round"/>
                           <path d="M21.0625 21.0625L10.9375 10.9375" stroke="white" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round"/>
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
            </Modal>
        </WalletAuthContext.Provider>
    )
}

export default WalletAuthWrapper
