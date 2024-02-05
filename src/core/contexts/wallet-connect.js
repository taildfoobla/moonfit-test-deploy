import React, {useState, useEffect, createContext, useContext, useReducer} from "react"
import {createWeb3Modal, defaultWagmiConfig} from "@web3modal/wagmi/dist/esm/exports/react"
import {
    arbitrum,
    avalanche,
    bsc,
    fantom,
    gnosis,
    mainnet,
    optimism,
    polygon,
    moonbaseAlpha,
    baseGoerli,
} from "wagmi/chains"
import {walletConnectProvider, EIP6963Connector} from "@web3modal/wagmi"
import {WalletConnectModal} from "@walletconnect/modal"

import {WagmiConfig, configureChains, createConfig} from "wagmi"
import {publicProvider} from "wagmi/providers/public"
import {CoinbaseWalletConnector} from "wagmi/connectors/coinbaseWallet"
import {InjectedConnector} from "wagmi/connectors/injected"
import {WalletConnectConnector} from "wagmi/connectors/walletConnect"

import HomeTest from "./Home"
import {LOCALSTORAGE_KEY, getLocalStorage} from "../utils/helpers/storage"

export const chainsA = [mainnet, polygon, avalanche, arbitrum, bsc, optimism, gnosis, fantom, moonbaseAlpha, baseGoerli]
const projectId = "9328f8e7d9c506e6120b5ae8a939feeb"

const metadata = {
    name: "MoonFit - Web3 & NFT Lifestyle App",
    description:
        "MoonFit is a Web3 & NFT lifestyle app that promotes active living by rewarding users anytime they burn calories through physical activities.",
    url: "https://app.moonfit.xyz",
    icons: ["https://prod-cdn.moonfit.xyz/image/original/assets/images/preview/web-preview_1.png"],
}

const {chains, publicClient} = configureChains(chainsA, [walletConnectProvider({projectId}), publicProvider()])

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
        new WalletConnectConnector({chains, options: {projectId, showQrModal: false, metadata}}),
        new EIP6963Connector({chains}),
        new InjectedConnector({chains, options: {shimDisconnect: true}}),
        new CoinbaseWalletConnector({chains, options: {appName: metadata.name}}),
    ],
    publicClient,
})

createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
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
    console.log("store", store)
    if (store?.state?.data?.account) {
        console.log("here")
        return store?.state?.data
    } else {
        return {}
    }
}

const initalState = {
    isConnectedWalletConnect: getConnectedLocalData(),
    accountDataWalletConnect: getAccountLocalData(),
}
console.log("isConnected", initalState.isConnected)
console.log("accountData", initalState.accountData)
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
    
    const handleConnectWalletConnect=()=>{
        dispatch({type:ACTIONS.connect})
    }

    const handleDisconnectWalletConnect = () => {
        dispatch({type:ACTIONS.disconnect})
    }

    const context = {
        walletConnect: state,
        handleConnectWalletConnect,
        handleDisconnectWalletConnect
    }

    return (
        <WalletConnectContext.Provider value={context}>
            <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
        </WalletConnectContext.Provider>
    )
}

export const useWalletConnect = () => {
    const context = useContext(WalletConnectContext)
    return context
}

