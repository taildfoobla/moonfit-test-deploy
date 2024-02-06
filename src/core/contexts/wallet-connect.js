import React, {useState, useEffect, createContext, useContext, useReducer} from "react"
import {
    createWeb3Modal,
    defaultWagmiConfig,
    useWeb3Modal,
    useWeb3ModalState,
} from "@web3modal/wagmi/dist/esm/exports/react"
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

import {
    WagmiConfig,
    configureChains,
    createConfig,
    useAccount,
    useDisconnect,
    useSendTransaction,
    useSwitchNetwork,
} from "wagmi"
import {publicProvider} from "wagmi/providers/public"
import {CoinbaseWalletConnector} from "wagmi/connectors/coinbaseWallet"
import {InjectedConnector} from "wagmi/connectors/injected"
import {WalletConnectConnector} from "wagmi/connectors/walletConnect"

import HomeTest from "./Home"
import {LOCALSTORAGE_KEY, getLocalStorage, setLocalStorage} from "../utils/helpers/storage"
import {onIdTokenChanged} from "firebase/auth"
import {parseEther, parseGwei} from "viem"
import {useAuth} from "./auth"

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
    setAddress: "SET_ADDRESS",
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
    isConnectedWalletConnect: false,
    accountDataWalletConnect: "",
}

const reducer = (state, action) => {
    const {type, value} = action
    switch (type) {
        case ACTIONS.disconnect:
            return {...state, isConnectedWalletConnect: false}
        case ACTIONS.connect:
            return {...state, isConnectedWalletConnect: true}
        case ACTIONS.setAddress:
            return {...state, accountDataWalletConnect: value}
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

    const handleSetAddress = (address) => {
        dispatch({type: ACTIONS.setAddress, value: address})
    }

    const context = {
        walletConnect: state,
        handleConnectWalletConnect,
        handleDisconnectWalletConnect,
        handleSetAddress,
    }

    return (
        <WalletConnectContext.Provider value={context}>
            <WagmiConfig config={wagmiConfig}>
                <WalletConnectWrapper>{children}</WalletConnectWrapper>
            </WagmiConfig>
        </WalletConnectContext.Provider>
    )
}

function WalletConnectWrapper({children}) {

    const context = useContext(WalletConnectContext)
    const {walletConnect, handleConnectWalletConnect, handleDisconnectWalletConnect, handleSetAddress} = context
    const {open, close} = useWeb3Modal()
    const {selectedNetworkId} = useWeb3ModalState()

    const {disconnect} = useDisconnect()
    const {sendTransactionAsync} = useSendTransaction()
    const {switchNetworkAsync} = useSwitchNetwork()
    const {address, isConnected} = useAccount()

    const {isOpenWalletConnectModal,handleToggleConnect} = useAuth()

    useEffect(() => {
        if (isConnected) {
            handleConnectWalletConnect()
            handleSetAddress(address)
            handleToggleConnect("CONNECT",address)
            const walletData={account:address}
            setLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT,JSON.stringify(walletData))
        } else {
            handleDisconnectWalletConnect()
            handleSetAddress("")
            // handleToggleConnect("DISCONNECT",address)

        }
    }, [isConnected])

    useEffect(() => {
        if(isOpenWalletConnectModal){
            open()
        }
    }, [isOpenWalletConnectModal])

    return <>{children}</>
}

export const useWalletConnect = () => {
    const context = useContext(WalletConnectContext)
    const {walletConnect, handleConnectWalletConnect, handleDisconnectWalletConnect} = context
    const {open, close} = useWeb3Modal()
    const {selectedNetworkId} = useWeb3ModalState()

    const {disconnect} = useDisconnect()
    const {sendTransactionAsync} = useSendTransaction()
    const {switchNetworkAsync} = useSwitchNetwork()
    const {address, isConnected} = useAccount()

    const handleDisConnected = () => {
        disconnect()
        handleDisconnectWalletConnect()
    }

    const handleOpenModalWalletConnect = () => {
        open()
    }

    const handleSendTransaction = async (chainId, data) => {
        const sendData = {
            chainId: chainId,
            data: data?.data,
            // gas:parseGwei(`${parseInt(data?.gas, 16)/Math.pow(10,18)}`),
            // maxFeePerGas:parseGwei(`${parseInt(data?.maxFeePerGas, 16)/Math.pow(10,18)}`),
            // maxPriorityFeePerGas:parseGwei(`${parseInt(data?.maxPriorityFeePerGas, 16)/Math.pow(10,18)}`),
            to: data?.to,
            value: parseEther(`${parseInt(data?.value, 16)}`),
        }

        if (selectedNetworkId !== chainId) {
            await switchNetworkAsync(chainId)
        }
       return await sendTransactionAsync(sendData)
    }

    return {...context, handleDisConnected, handleOpenModalWalletConnect, handleSendTransaction}
}

