import React, {useState, useEffect, createContext, useContext, useReducer} from "react"
import {getLocalStorage, LOCALSTORAGE_KEY, setLocalStorage} from "../utils/helpers/storage"
import { chains } from "../utils/constants/wallet-connect"
import {BrowserProvider, parseEther, parseGwei} from "ethers"
import {createWeb3Modal, defaultConfig} from "@web3modal/ethers/react"
import {useWeb3Modal} from "@web3modal/ethers/react"
import {useAuth} from "./auth"
import {useWeb3ModalAccount, useWeb3ModalProvider, useSwitchNetwork, useDisconnect} from "@web3modal/ethers/react"
// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "2d6d4341d352937d613828ea6124a208"

// 2. Set chains


// 3. Create modal
const metadata = {
    name: "My Website",
    description: "My Website description",
    url: "https://mywebsite.com", // origin must match your domain & subdomain
    icons: ["https://avatars.mywebsite.com/"],
}

createWeb3Modal({
    ethersConfig: defaultConfig({metadata}),
    chains,
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
})

const ACTIONS = {
    disconnect: "DISCONNECT",
    connect: "CONNECT",
}

const initalState = {
    isConnectedWalletConnect: false,
    accountDataWalletConnect: "",
}

const reducer = (state, action) => {
    const {type, value} = action
    switch (type) {
        case ACTIONS.disconnect:
            return {...state, isConnectedWalletConnect: false, accountDataWalletConnect: value}
        case ACTIONS.connect:
            return {...state, isConnectedWalletConnect: true, accountDataWalletConnect: value}
        case ACTIONS.setAddress:
            return {...state, accountDataWalletConnect: value}
    }
}

export const WalletConnectContext = createContext()

export default function WalletConnectProvider({children}) {
    const [state, dispatch] = useReducer(reducer, initalState)
    const {
        isOpenWalletConnectModal,
        setIsOpenWalletConnectModal,
        handleToggleConnect,
        setIsConnectedThroughWalletConnect,
        signatureData,
        setSignatureData
    } = useAuth()
    const {open} = useWeb3Modal()
    const {address, chainId, isConnected} = useWeb3ModalAccount()
    const {walletProvider} = useWeb3ModalProvider()
    const {disconnect} = useDisconnect()
    const {switchNetwork} = useSwitchNetwork()

    useEffect(() => {
        if (isOpenWalletConnectModal) {
            handleOpenWalletConnect()
            setIsOpenWalletConnectModal(false)
        }
    }, [isOpenWalletConnectModal])

    useEffect(() => {
        if (isConnected) {
            handleSignMessage()
        }
    }, [isConnected])

    const handleOpenWalletConnect = () => {
        open()
    }

    const handleConnectWalletConnect = (address) => {
        dispatch({type: ACTIONS.connect, value: address})
        handleToggleConnect("CONNECT", address)
    }

    const handleDisconnectWalletConnect = () => {
        disconnect()
        dispatch({type: ACTIONS.disconnect, value: ""})
    }

    const handleSignMessage = async () => {
        try {
            const signatureLocal = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))
            if (signatureLocal && isConnected) {
                console.log("here")
                handleConnectWalletConnect(address)
                setIsConnectedThroughWalletConnect(true)
                setSignatureData(signatureLocal?.signature)
            } else {
                const provider = new BrowserProvider(walletProvider)
                const signer = await provider.getSigner()
                const signMessage = `MoonFit:${address}:${new Date().getTime()}`
                const signature = await signer?.signMessage(signMessage)
                if (signature) {
                    const signData = {
                        message: signMessage,
                        signature,
                        wallet_address: address,
                    }

                    handleConnectWalletConnect(address)
                    setIsConnectedThroughWalletConnect(true)
                    const walletData = {account: address}
                    setLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT, JSON.stringify(walletData))

                    setLocalStorage(
                        LOCALSTORAGE_KEY.WALLET_SIGNATURE,
                        JSON.stringify({
                            account: address,
                            signature: signData,
                        })
                    )
                    setSignatureData(signData)
                } else {
                    handleDisconnectWalletConnect()
                }
            }
        } catch (err) {
            console.log("err", err)
            handleDisconnectWalletConnect()
        }
    }

    const handleSendTransaction = async (id, data) => {
        try {
            const provider = new BrowserProvider(walletProvider)
            const signer = await provider.getSigner()
            if (chainId !== id) {
                await switchNetwork(id)
            }
            let sendData
            if (data?.value) {
                sendData = {
                    data: data?.data,
                    to: data?.to,
                    value: parseEther(`${parseInt(data?.value, 16)}`),
                }
            } else {
                sendData = {
                    data: data?.data,
                    to: data?.to,
                }
            }
            console.log(sendData)
            const tx = await signer.sendTransaction(sendData)
            return tx
        } catch (err) {
            console.log("err", err)
        }
    }

    const context = {
        walletConnectState: state,
        handleOpenWalletConnect,
        handleConnectWalletConnect,
        handleDisconnectWalletConnect,
        handleSendTransaction,
    }
    return <WalletConnectContext.Provider value={context}>{children}</WalletConnectContext.Provider>
}

export const useWalletConnect = () => {
    const context = useContext(WalletConnectContext)

    return context
}

