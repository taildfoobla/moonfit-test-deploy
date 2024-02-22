import React, {useState, useEffect, createContext, useContext, useReducer} from "react"
import { getLocalStorage,LOCALSTORAGE_KEY,setLocalStorage } from "../utils/helpers/storage"
import {createWeb3Modal, defaultConfig} from "@web3modal/ethers/react"
import {useWeb3Modal} from "@web3modal/ethers/react"
import {useAuth} from "./auth"
import { useWeb3ModalAccount,useWeb3ModalProvider,useSwitchNetwork,useDisconnect } from '@web3modal/ethers/react'
// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "2d6d4341d352937d613828ea6124a208"

// 2. Set chains
const mainnet = {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://cloudflare-eth.com",
}
const moonbaseAlpla = {
    chainId: 1287,
    name: "Moonbase Alpha",
    currency: "DEV",
    explorerUrl: "https://moonbase.moonscan.io",
    rpcUrl: "https://rpc.api.moonbase.moonbeam.network",
}

// 3. Create modal
const metadata = {
    name: "My Website",
    description: "My Website description",
    url: "https://mywebsite.com", // origin must match your domain & subdomain
    icons: ["https://avatars.mywebsite.com/"],
}

createWeb3Modal({
    ethersConfig: defaultConfig({metadata}),
    chains: [mainnet, moonbaseAlpla],
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
            return {...state, isConnectedWalletConnect: false,accountDataWalletConnect:value}
        case ACTIONS.connect:
            return {...state, isConnectedWalletConnect: true,accountDataWalletConnect:value}
        case ACTIONS.setAddress:
            return {...state, accountDataWalletConnect: value}
    }
}

export const WalletConnectContext = createContext()

export default function WalletConnectProvider({children}) {
    const [state, dispatch] = useReducer(reducer, initalState)
    const {isOpenWalletConnectModal, setIsOpenWalletConnectModal,handleToggleConnect} = useAuth()
    const {open} = useWeb3Modal()
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const {walletProvider} = useWeb3ModalProvider()
    const { disconnect } = useDisconnect()
    const {switchNetwork} =useSwitchNetwork()


    useEffect(()=>{
        if(isOpenWalletConnectModal){
            handleOpenWalletConnect()
            setIsOpenWalletConnectModal(false)
        }
    },[isOpenWalletConnectModal])

    useEffect(()=>{
        if(isConnected){
            // handleSignMessage()
        }else{

        }
    },[isConnected])

    const handleOpenWalletConnect = () => {
        open()
    }

    const handleConnectWalletConnect = (address) => {
        dispatch({type: ACTIONS.connect,value:address})
    }

    const handleDisconnectWalletConnect = (address) => {
        dispatch({type: ACTIONS.disconnect,value:address})
    }

    const handleSignMessage=async()=>{
        const provider = new BrowserProvider(walletProvider)       
        const signer = await provider.getSigner()
 
        const signMessage = `MoonFit:${address}:${new Date().getTime()}`
        const signature=  await signer?.signMessage(
            signMessage
        )
        console.log("signature",signature)
        if(signature){
            console.log("here")
            const signData = {
                message: signMessage,
                signature,
                wallet_address: address,
            }
    
            handleConnectWalletConnect(address)
            handleToggleConnect("CONNECT",address)
            const walletData={account:address}
            setLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT,JSON.stringify(walletData))
    
            setLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE,JSON.stringify({
                account:address,
                signature:signData
            }))
        }else{
            disconnect()
        }
    }



    const context = {
        walletConnect: state,
        handleConnectWalletConnect,
        handleDisconnectWalletConnect,
    }
    return <WalletConnectContext.Provider value={context}>{children}</WalletConnectContext.Provider>
}

