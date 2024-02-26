export const chains = [
    {
        chainId: 1,
        name: "Ethereum",
        currency: "ETH",
        explorerUrl: "https://etherscan.io",
        rpcUrl: "https://cloudflare-eth.com",
    },
    {
        chainId: 1287,
        name: "Moonbase Alpha",
        currency: "DEV",
        explorerUrl: "https://moonbase.moonscan.io",
        rpcUrl: "https://rpc.api.moonbase.moonbeam.network",
    },
    {
        chainId: 1284,
        name: "Moonbeam",
        currency: "GLMR",
        explorerUrl: "https://moonbeam.moonscan.io",
        rpcUrl: "https://rpc.ankr.com/moonbeam",
    },
    {
        chainId: 592,
        name: "Astar",
        currency: "ASTR",
        explorerUrl: "https://blockscout.com/astar",
        rpcUrl: "https://evm.astar.network",
    },
    {
        chainId: 81,
        name: "Shibuya Testnet",
        currency: "SBY",
        explorerUrl: "https://blockscout.com/shibuya",
        rpcUrl: "https://rpc.shibuya.astar.network",
    },
]

export const chainsToAdd = [
    {
        id: 1287,
        params: {
            chainId: "0x507",
            rpcUrls: ["https://rpc.api.moonbase.moonbeam.network"],
            chainName: "MoonbaseAlpha",
            nativeCurrency: {name: "DEV", decimals: 18, symbol: "DEV"},
            blockExplorerUrls: ["https://moonbase.moonscan.io/"],
        },
    },
    {
        id: 1284,
        params: {
            chainId: "0x504",
            rpcUrls: ["https://rpc.api.moonbeam.network"],
            chainName: "Moonbeam",
            nativeCurrency: {name: "GLMR", decimals: 18, symbol: "GLMR"},
            blockExplorerUrls: ["https://moonbeam.moonscan.io/"],
        },
    },
    {
        id: 81,
        params: {
            chainId: "0x51",
            rpcUrls: ["https://evm.shibuya.astar.network"],
            chainName: "Shibuya Testnet",
            nativeCurrency: {name: "SBY", decimals: 18, symbol: "SBY"},
            blockExplorerUrls: ["https://blockscout.com/shibuya"],
        },
    },
    {
        id: 592,
        params: {
            chainId: "0x250",
            rpcUrls: ["https://evm.astar.network"],
            chainName: "Astar",
            nativeCurrency: {name: "ASTR", decimals: 18, symbol: "ASTR"},
            blockExplorerUrls: ["https://blockscout.com/astar"],
        },
    },
]

