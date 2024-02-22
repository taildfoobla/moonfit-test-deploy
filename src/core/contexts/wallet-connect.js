import React, {useState, useEffect, createContext, useContext, useReducer} from "react"
import {getLocalStorage, LOCALSTORAGE_KEY} from "../utils/helpers/storage"
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '2d6d4341d352937d613828ea6124a208'

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}
const moonbaseAlpla = {
    chainId: 1287,
    name: 'Moonbase Alpha',
    currency: 'DEV',
    explorerUrl: 'https://moonbase.moonscan.io',
    rpcUrl: 'https://rpc.api.moonbase.moonbeam.network'
  }

// 3. Create modal
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/']
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnet,moonbaseAlpla],
  projectId,
  enableAnalytics: true // Optional - defaults to your Cloud configuration
})


const ACTIONS = {
    disconnect: "DISCONNECT",
    connect: "CONNECT",
}

const getConnectedLocalData = () => {
    const walletConnectIsConnected = getLocalStorage(LOCALSTORAGE_KEY.wagmi_connected)
    if (walletConnectIsConnected) {
        return walletConnectIsConnected
    } else {
        return false
    }
}

const getAccountLocalData = () => {
    const store = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.wagmi_store))
    if (store?.state?.data?.account) {
        return store?.state?.data
    } else {
        return {}
    }
}

const initalState = {
    isConnectedWalletConnect: getConnectedLocalData(),
    accountDataWalletConnect: getAccountLocalData(),
}

const reducer = (state, action) => {
    const {type, value} = action
    switch (type) {
        case ACTIONS.disconnect:
            return {...state, accountDataWalletConnect: false}
        case ACTIONS.disconnect:
            return {...state, isConnectedWalletConnect: false}
    }
}

export const WalletConnectContext = createContext()

export default function WalletConnectProvider({children}) {
    const [state, dispatch] = useReducer(reducer, initalState)

    const handleConnectWalletConnect = () => {
        dispatch({type: ACTIONS.connect})
    }

    const handleDisconnectWalletConnect = () => {
        dispatch({type: ACTIONS.disconnect})
    }

    const context = {
        walletConnect: state,
        handleConnectWalletConnect,
        handleDisconnectWalletConnect,
    }

    return (
        <WalletConnectContext.Provider value={context}>
          {children}
        </WalletConnectContext.Provider>
    )
}

export const useWalletConnect = () => {
    const context = useContext(WalletConnectContext)
    return context
}

