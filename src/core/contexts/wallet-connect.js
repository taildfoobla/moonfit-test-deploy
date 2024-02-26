import React, {useState, useEffect, createContext, useContext, useReducer} from "react"
import {getLocalStorage, LOCALSTORAGE_KEY, setLocalStorage} from "../utils/helpers/storage"
import { message as AntdMessage } from "antd"
import { chains, chainsToAdd } from "../utils/constants/wallet-connect"
import {BrowserProvider, parseEther, parseGwei} from "ethers"
import {createWeb3Modal, defaultConfig} from "@web3modal/ethers/react"
import {useWeb3Modal} from "@web3modal/ethers/react"
import {useAuth} from "./auth"
import {useWeb3ModalAccount, useWeb3ModalProvider, useSwitchNetwork, useDisconnect} from "@web3modal/ethers/react"
import { getShortAddress } from "../utils/helpers/blockchain"
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
        setSignatureData,
        onDisconnect
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
        }else{
            handleDisconnectWalletConnect()
            onDisconnect()
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
                    AntdMessage.success({
                        key: "success",
                        content: `Successfully to connect with ${getShortAddress(address,6)}`,
                        className: "message-success",
                        duration: 5,
                    })
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
        const provider = new BrowserProvider(walletProvider)
        const signer = await provider.getSigner()
        try {
            // if (chainId !== id) {
            //     await switchNetwork(id)
            // }
           await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [{
                    chainId: "0x89",
                    rpcUrls: ["https://rpc-mainnet.matic.network/"],
                    chainName: "Matic Mainnet",
                    nativeCurrency: {
                        name: "MATIC",
                        symbol: "MATIC",
                        decimals: 18
                    },
                    blockExplorerUrls: ["https://polygonscan.com/"]
                }]
            });
            let sendData
            if (data?.value) {
                sendData = {
                    data: data?.data,
                    to: data?.to,
                    // value: parseEther(`${parseInt(data?.value, 16)}`),
                    value:data?.value
                }
            } else {
                sendData = {
                    data: data?.data,
                    to: data?.to,
                }
            }
            const tx = await signer.sendTransaction(sendData)
            return tx?.hash
        } catch (err) {
            console.log("err", err)
            provider.on
            await provider.request(
               {
                method: "wallet_addEthereumChain",
                params: [chainsToAdd.find(chain=>chain.id===id)?.params||{}]
               })
            await handleSendTransaction(id,data)

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

