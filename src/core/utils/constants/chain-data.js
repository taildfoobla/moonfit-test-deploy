
export const chain={
    astarTestnet:{
        id: 81,
        name: 'Moonbase Alpha',
        network: 'moonbase-alpha',
        nativeCurrency: { name: 'SBY', decimals: 18, symbol: 'SBY' },
        rpcUrls: {
          default: {
            http: ['https://evm.shibuya.astar.network']
          }
        
        },
        blockExplorers: {
          default: {
            name: 'Moonscan',
            url: 'https://moonbase.moonscan.io',
          },
          etherscan: {
            name: 'Moonscan',
            url: 'https://moonbase.moonscan.io',
          },
        },
        contracts: {
          multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 1850686,
          },
        },
        testnet: true,
    }
}


const getChainData = (env) => {
    switch (env) {
        case "production":
            return [
                {name: "moonbeam", chainId: 1284},
                {
                    name: "astar",
                    chainId: 592,
                },
            ]
        case "development":
            return [
                {name: "moonbeam", chainId: 1287},
                {
                    name: "astar",
                    chainId: 81,
                },
            ]
        default:
            return [
                {name: "moonbeam", chainId: 1284},
                {
                    name: "astar",
                    chainId: 592,
                },
            ]
    }
}
const env = process.env.REACT_APP_ENV
export const chainData = getChainData(env)

