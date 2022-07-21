import React, {useCallback, useEffect, useState} from 'react'
import WalletAuthContext from "../contexts/WalletAuthContext"
import {switchNetwork} from "../utils/blockchain"
import Web3 from "web3"
import {getLocalStorage, LOCALSTORAGE_KEY, removeLocalStorage, setLocalStorage} from "../utils/storage"
import {useHistory} from "react-router-dom"
import Paths from "../routes/Paths"
import {SUBWALLET_EXT_URL, WEB3_METHODS} from "../constants/blockchain"
import {Modal} from "antd"

const providerReadyEvent = {
    'ethereum': 'ethereum#initialized', // Metamask ready event
    'SubWallet': 'subwallet#initialized' // SubWallet ready event
}

const WalletAuthWrapper = ({children}) => {
    const [isConnected, setIsConnected] = useState(false)
    const [wallet, setWallet] = useState({})
    const [walletExtKey,] = useState('SubWallet')
    const [provider, setProvider] = useState(null)
    const [isModalVisible, setIsModalVisible] = useState(false)

    const history = useHistory()

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

    const retrieveCurrentWalletInfo = useCallback(async () => {
        const provider = await detectProvider(walletExtKey)
        const web3 = new Web3(provider)
        const walletAccount = await web3.eth.getAccounts()
        const account = walletAccount[0]
        let ethBalance = await web3.eth.getBalance(account) // Get wallet balance
        ethBalance = web3.utils.fromWei(ethBalance, 'ether') //Convert balance to wei
        const chainId = await provider.request({method: 'eth_chainId'})
        saveWalletInfo(ethBalance, account, chainId)
    }, [walletExtKey, saveWalletInfo])

    const handleWalletChange = useCallback(async (wallets) => {
        // console.log(wallets, wallet.account)
        if (!wallet.account) return false

        const provider = await detectProvider(walletExtKey)
        if (!provider) {
            console.log("HandleWalletChange: SubWallet is not installed")
            return false
        }

        if (wallets.length === 0) return true
        else if (wallets.length === 1) {
            // console.log(wallet.account, wallets[0])
            setIsModalVisible(false)
            wallet.account !== wallets[0] && await retrieveCurrentWalletInfo()
        } else {
            setIsModalVisible(true)
        }
    }, [wallet, walletExtKey, retrieveCurrentWalletInfo])

    useEffect(() => {
        detectProvider(walletExtKey).then(async provider => {
            await provider.enable()
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
        return () => provider?.off('accountsChanged', handleWalletChange)
    }, [provider, walletExtKey, handleWalletChange])

    const detectProvider = (providerName) => {
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
    }

    const onConnect = async () => {
        try {
            const provider = await detectProvider(walletExtKey)
            if (!provider) {
                console.log('SubWallet is not installed')
                return window.open(SUBWALLET_EXT_URL)
            }
            await provider.request({method: 'eth_requestAccounts'})
            // const chainId = await provider.request({method: 'eth_chainId'})

            await switchNetwork(provider)
            await retrieveCurrentWalletInfo()

            // const web3 = new Web3(provider)
            // const walletAccount = await web3.eth.getAccounts()
            // const account = walletAccount[0]
            // let ethBalance = await web3.eth.getBalance(account) // Get wallet balance
            // ethBalance = web3.utils.fromWei(ethBalance, 'ether') //Convert balance to wei
            // saveWalletInfo(ethBalance, account, chainId)

            // Go to Mint Pass page
            history.push(Paths.MintPassMinting.path)
        } catch (err) {
            console.log(
                'There was an error fetching your accounts. Make sure your SubWallet is configured correctly.', err
            )
        }
    }

    const onDisconnect = (callback = null) => {
        removeLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT)
        setWallet({})
        setIsConnected(false)
        callback && callback()
    }

    const onAuthorizeNewWallet = async () => {
        const provider = await detectProvider(walletExtKey)
        await provider.request(WEB3_METHODS.requestPermissions)
        setIsModalVisible(false)
        await retrieveCurrentWalletInfo()
    }

    const onAuthorizeMoreWallet = async () => {
        const provider = await detectProvider(walletExtKey)
        await provider.request(WEB3_METHODS.requestPermissions)
        await retrieveCurrentWalletInfo()
    }

    return (
        <WalletAuthContext.Provider
            value={{wallet, setWallet, onConnect, onDisconnect, isConnected, detectProvider, onAuthorizeMoreWallet}}>
            {children}
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
                   wrapClassName={'mf-modal unauthorized-wallet-modal z-[9999]'}
                   className={'mf-modal-content unauthorized-wallet-modal-content'}
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
