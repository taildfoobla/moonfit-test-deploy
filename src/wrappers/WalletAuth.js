import React, {useEffect, useState} from 'react'
import WalletAuthContext from "../contexts/WalletAuthContext"
import {switchNetwork} from "../utils/blockchain"
import Web3 from "web3"
import {getLocalStorage, LOCALSTORAGE_KEY, removeLocalStorage, setLocalStorage} from "../utils/storage"
import {getReactEnv} from "../utils/env"

const providerReadyEvent = {
    'ethereum': 'ethereum#initialized', // Metamask ready event
    'SubWallet': 'subwallet#initialized' // SubWallet ready event
}
const SUBWALLET_EXT_URL = getReactEnv('SUBWALLET_EXT')

const WalletAuthWrapper = ({children}) => {
    const [isConnected, setIsConnected] = useState(false)
    const [wallet, setWallet] = useState({})

    useEffect(() => {
        function checkConnectedWallet() {
            const userData = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT))
            if (userData != null) {
                setWallet(userData)
                setIsConnected(true)
            }
        }

        checkConnectedWallet()
    }, [])

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
            const provider = await detectProvider('SubWallet')
            if (!provider) {
                console.log('SubWallet is not installed')
                return window.open(SUBWALLET_EXT_URL)
            }
            await provider.request({method: 'eth_requestAccounts'})
            const chainId = await provider.request({method: 'eth_chainId'})

            await switchNetwork(provider)

            const web3 = new Web3(provider)
            const walletAccount = await web3.eth.getAccounts()
            const account = walletAccount[0]
            let ethBalance = await web3.eth.getBalance(account) // Get wallet balance
            ethBalance = web3.utils.fromWei(ethBalance, 'ether') //Convert balance to wei
            saveWalletInfo(ethBalance, account, chainId)
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

    const saveWalletInfo = (ethBalance, account, chainId) => {
        const walletAccount = {
            account: account,
            balance: ethBalance,
            chainId: chainId,
        }
        setLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT, JSON.stringify(walletAccount)) // user persisted data
        const userData = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT))
        setWallet(userData)
        setIsConnected(true)
    }

    return (
        <WalletAuthContext.Provider value={{wallet, setWallet, onConnect, onDisconnect, isConnected, detectProvider}}>
            {children}
        </WalletAuthContext.Provider>
    )
}

export default WalletAuthWrapper
