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

    const context = {
        walletConnect: state,
        handleConnectWalletConnect,
        handleDisconnectWalletConnect,
    }
    console.log("projectId",projectId)
    return (
        <WalletConnectContext.Provider value={context}>
          {children}
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
    const {signMessageAsync } = useSignMessage()

    const {isOpenWalletConnectModal,handleToggleConnect,handleToggleWalletConnectModal} = useAuth()

    useEffect(() => {
        if (isConnected) {
            console.log("isConnect")
            const signMessage = `MoonFit:${address}:${new Date().getTime()}`
            handleSignMessage()
          
        } else {
            handleDisconnectWalletConnect()
            handleSetAddress("")
            // handleToggleConnect("DISCONNECT",address)

        }
    }, [isConnected])

    useEffect(() => {
        if(isOpenWalletConnectModal){
            open()
            handleToggleWalletConnectModal()
        }
    }, [isOpenWalletConnectModal])

    const handleSignMessage=async()=>{
        const walletSignatureLocal=JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))


        if(!walletSignatureLocal){
            const signMessage = `MoonFit:${address}:${new Date().getTime()}`
            const signature=  await signMessageAsync({
                message:signMessage
            })
            // console.log("signature",signature)
            if(signature){
                console.log("here")
                const signData = {
                    message: signMessage,
                    signature,
                    wallet_address: address,
                }
        
                handleConnectWalletConnect()
                handleSetAddress(address)
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
        }else{
            handleConnectWalletConnect()
            handleSetAddress(address)
            handleToggleConnect("CONNECT",address)
            const walletData={account:address}
            setLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT,JSON.stringify(walletData))
        }

     
       


    }

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
        let sendData 
        
        if(data?.value){
            sendData= {
                chainId: chainId,
                data: data?.data,
                // gas:parseGwei(`${parseInt(data?.gas, 16)/Math.pow(10,18)}`),
                // maxFeePerGas:parseGwei(`${parseInt(data?.maxFeePerGas, 16)/Math.pow(10,18)}`),
                // maxPriorityFeePerGas:parseGwei(`${parseInt(data?.maxPriorityFeePerGas, 16)/Math.pow(10,18)}`),
                to: data?.to,
                value: parseEther(`${parseInt(data?.value, 16)}`),
            }
        }else{
            sendData= {
                chainId: chainId,
                data: data?.data,
                // gas:parseGwei(`${parseInt(data?.gas, 16)/Math.pow(10,18)}`),
                // maxFeePerGas:parseGwei(`${parseInt(data?.maxFeePerGas, 16)/Math.pow(10,18)}`),
                // maxPriorityFeePerGas:parseGwei(`${parseInt(data?.maxPriorityFeePerGas, 16)/Math.pow(10,18)}`),
                to: data?.to,
            }
        }
     

        if (selectedNetworkId !== chainId) {
            await switchNetworkAsync(chainId)
        }
       return await sendTransactionAsync(sendData)
    }

    return {...context, handleDisConnected, handleOpenModalWalletConnect, handleSendTransaction}
}

