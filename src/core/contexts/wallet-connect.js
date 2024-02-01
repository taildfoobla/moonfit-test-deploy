// import React, {createContext, useContext, useReducer} from "react"
// import {createWeb3Modal, defaultWagmiConfig} from "@web3modal/wagmi"
// import {
//     arbitrum,
//     avalanche,
//     bsc,
//     fantom,
//     gnosis,
//     mainnet,
//     optimism,
//     polygon,
//     moonbaseAlpha,
//     baseGoerli,
// } from "wagmi/chains"
// import { WagmiConfig } from "wagmi";

// const chains = [mainnet, polygon, avalanche, arbitrum, bsc, optimism, gnosis, fantom, moonbaseAlpha, baseGoerli]

// // const projectId = process.env.WALLET_CONNECT_PROJECT_ID || ""

// // console.log("env",process.env.REACT_APP_ENV)
// // console.log("id",process.env.WALLET_CONNECT_PROJECT_ID)

// // const metadata = {
// //     name: "MoonFit - Web3 & NFT Lifestyle App",
// //     description:
// //         "MoonFit is a Web3 & NFT lifestyle app that promotes active living by rewarding users anytime they burn calories through physical activities.",
// //     url: "https://app.moonfit.xyz",
// //     icons: ["https://prod-cdn.moonfit.xyz/image/original/assets/images/preview/web-preview_1.png"],
// // }

// // const wagmiConfig = defaultWagmiConfig({chains, projectId, metadata})

// // createWeb3Modal({wagmiConfig, projectId, chains})

// const initalState = {}

// const reducer = (state, action) => {
//     const {type, value} = action
//     switch (type) {
//     }
// }

// export const WalletConnectContext = createContext()

// export default function WalletConnectProvider({children}) {
//     const [state, dispatch] = useReducer(reducer, initalState)

//     const context = {
//         walletConnect: state,
//     }

//     return (
//         <WalletConnectContext.Provider value={context}>{children}
//             {/* <WagmiConfig config={wagmiConfig}>{children} </WagmiConfig> */}
//         </WalletConnectContext.Provider>
//     )
// }

// export const useWalletConnect = () => {
//     const context = useContext(WalletConnectContext)
//     return context
// }

