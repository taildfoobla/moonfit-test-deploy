import React, {useRef} from "react"


import {useDisconnect} from "wagmi"
import {useSendTransaction} from "wagmi"
import {parseEther} from "viem"
import {parseGwei} from "viem"
import {useSwitchNetwork} from "wagmi"
import {chainsA} from "./wallet-connect"
import {useAccount} from "wagmi"
import {useWeb3Modal} from "../../../node_modules/@web3modal/wagmi/dist/esm/exports/react"

export default function HomeTest() {
    const {open, close} = useWeb3Modal()
    const {disconnect} = useDisconnect()
    const {data, isLoading, isSuccess, sendTransaction, sendTransactionAsync} = useSendTransaction()
    const {chains, error, pendingChainId, switchNetwork} = useSwitchNetwork()
    const openWeb3ModalRef = useRef(null)

    return (
        <div style={{paddingTop: "200px", background: "#FFF"}}>
            <button
                onClick={async () => {
                    console.log(openWeb3ModalRef)
                   openWeb3ModalRef.current.click();
                   open()
                }}
            >
                Open Modal
            </button>
            <w3m-button ref={openWeb3ModalRef} onClick={()=>{
                console.log("trigger success")
            }} />
            <button onClick={disconnect}>Disconnect</button>
            <button
                onClick={async () => {
                    const data = await sendTransactionAsync({
                        chainId: 1287,
                        data: "0x01cdef1e0000000000000000000000000000000000000000000000000000018d63788051000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080553246736447566b58312f32436a43505561313851432f5a457661624e45724a59756e487863447475744654456561466d6b6d65536b4c42572b454b5872354f49455239644d696247746244486538304c46647261344b5870784731515a336d704b395244635044347958494251646452366143676d70444b6b4f73615a6569",
                        gas: parseGwei("0"),
                        maxFeePerGas: parseGwei("0.2"),
                        maxPriorityFeePerGas: parseGwei("0.2"),
                        to: "0xF20771425EAc6Ed2752D7899aB148bacDB0d34eB",
                        value: parseEther("0.01"),
                    })
                }}
            >
                Send Transaction
            </button>
        </div>
    )
}

