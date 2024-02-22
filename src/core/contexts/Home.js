import React from "react"
import {BrowserProvider, hexlify} from "ethers"
import {useWeb3ModalProvider} from "@web3modal/ethers/react"
import {parseEther} from "ethers"
import { ethers } from "ethers";
import { useWeb3ModalAccount } from '@web3modal/ethers/react'

export default function HomeTest() {
    const {walletProvider} = useWeb3ModalProvider()
    const { address, chainId, isConnected } = useWeb3ModalAccount()

    async function onSignMessage() {
        const provider = new BrowserProvider(walletProvider)
        console.log("provider", provider)
       
        const signer = await provider.getSigner()
        console.log("signer", signer)
        const signature = await signer?.signMessage("Hello Web3Modal Ethers")
        console.log(signature)
    }

    const handleSendTransaction = async () => {
        const provider = new BrowserProvider(walletProvider)
        const signer = await provider.getSigner()
        if(chainId!==1287){
            const t =await walletProvider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: '0x507' }]
            })
            console.log("t",t)
        }
        const test = {
            chainId: 1287,
            data: "0x01cdef1e0000000000000000000000000000000000000000000000000000018d63788051000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080553246736447566b58312f32436a43505561313851432f5a457661624e45724a59756e487863447475744654456561466d6b6d65536b4c42572b454b5872354f49455239644d696247746244486538304c46647261344b5870784731515a336d704b395244635044347958494251646452366143676d70444b6b4f73615a6569",
            to: "0xF20771425EAc6Ed2752D7899aB148bacDB0d34eB",
            value: parseEther("0.01"),
        }
        const tx = await signer.sendTransaction(test)
        console.log("tx", tx)
    }

    const x=useWalletConnect()

    return (
        <div style={{paddingTop: "100px"}}>
            <w3m-button />
            <w3m-network-button />
            <button onClick={() => onSignMessage()}>Sign Message</button>
            <button onClick={() => handleSendTransaction()}>Send Transaction</button>
        </div>
    )
}

