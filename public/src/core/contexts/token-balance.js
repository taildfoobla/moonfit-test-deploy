import React, {useContext, useEffect, useState} from "react"
import {useLocalStorage} from "../hooks/useLocalStorage"
import {LOCALSTORAGE_KEY, getLocalStorage} from "../utils/helpers/storage"
import Web3 from "web3"
import erc20Balance from "../abis/ERC20Balance.json"
import {getTokenBalance} from "../utils/helpers/blockchain"
import {useAuth} from "./auth"
import {BLC_CONFIGS} from "../utils/configs/blockchain"

const TokenBalanceContext = React.createContext()

const {MFG_SC, MFR_SC} = BLC_CONFIGS
const DEFAULT_BALANCE = {glmr: "0", mfg: "0", mfr: "0"}

const TokenBalanceProvider = ({children}) => {
    const [tokenBalance, setTokenBalance] = useState(DEFAULT_BALANCE)
    const network= JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.NETWORK))
    // const [network] = useLocalStorage(LOCALSTORAGE_KEY.NETWORK)
    const [loading, setLoading] = useState(false)

    const {
        auth: {user},
    } = useAuth()


    // useEffect(() => {
    //     const fetchTokenBalance = async () => {
    //         try {
    //             setLoading(true)

    //             const web3js = new Web3(network.rpc_url)
    //             const mfgContract = new web3js.eth.Contract(erc20Balance.abi, MFG_SC)
    //             const mfrContract = new web3js.eth.Contract(erc20Balance.abi, MFR_SC)

    //             const [mfgBalance, mfrBalance] = await Promise.all([
    //                 getTokenBalance(mfgContract.methods, user.account),
    //                 getTokenBalance(mfrContract.methods, user.account),
    //             ])
    //             const glmrBalance = await web3js.eth.getBalance(user.account) // Get wallets balance
    //             const rGlmrBalance = web3js.utils.fromWei(glmrBalance, "ether")
    //             setTokenBalance({mfg: mfgBalance, mfr: mfrBalance, glmr: rGlmrBalance})
                
    //         }finally {
    //             setLoading(false)
    //         }
    //     }

    //     if (user.account&&network!==null && network?.rpc_url) {
    //         console.log("here1")
    //         fetchTokenBalance()
    //     } 
    //     else {
    //         console.log("here2")
    //         setTokenBalance(DEFAULT_BALANCE)
    //         setLoading(false)
    //     }
    // }, [network?.rpc_url, user.account])

    return <TokenBalanceContext.Provider value={tokenBalance}>{!loading && children}</TokenBalanceContext.Provider>
}

function useTokeBalance() {
    const context = useContext(TokenBalanceContext)

    if (context === undefined) {
        throw new Error("useTokenBalance must be used within a TokenBalanceProvider")
    }

    return context
}

export {TokenBalanceProvider, useTokeBalance}
