import MetaMaskLogo from '../assets/images/wallets/MetaMaskLogo.svg';
import SubWalletLogo from '../assets/images/wallets/SubWalletLogo.svg';

export const MOONBEAM_CHAIN_ID = 504
export const MOONBEAM_CHAIN_ID_HEX = "0x504"
export const WEB3_METHODS = {
    addMoonbeamNetwork: {
        method: 'wallet_addEthereumChain',
        params: [
            {
                chainId: '0x504',
                rpcUrls: ['https://rpc.api.moonbeam.network'],
                chainName: 'Moonbeam',
                nativeCurrency: {name: 'GLMR', decimals: 18, symbol: 'GLMR'},
                blockExplorerUrls: ['https://moonbeam.moonscan.io/']
            }
        ]
    },
    switchToMoonbeamNetwork: {
        method: 'wallet_switchEthereumChain',
        params: [
            {
                chainId: '0x504'
            }
        ]
    },
    addMoonriverNetwork: {
        method: 'wallet_addEthereumChain',
        params: [
            {
                chainId: '0x505',
                rpcUrls: ['https://rpc.api.moonriver.moonbeam.network'],
                chainName: 'Moonriver',
                nativeCurrency: {name: 'MOVR', decimals: 18, symbol: 'MOVR'},
                blockExplorerUrls: ['https://moonriver.moonscan.io/']
            }
        ]
    },
    switchToMoonriverNetwork: {
        method: 'wallet_switchEthereumChain',
        params: [
            {
                chainId: '0x505'
            }
        ]
    },
    addMoonbaseAlphaNetwork: {
        method: 'wallet_addEthereumChain',
        params: [
            {
                chainId: '0x507',
                rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
                chainName: 'MoonbaseAlpha',
                nativeCurrency: {name: 'DEV', decimals: 18, symbol: 'DEV'},
                blockExplorerUrls: ['https://moonbase.moonscan.io/']
            }
        ]
    },
    switchToMoonbaseAlphaNetwork: {
        method: 'wallet_switchEthereumChain',
        params: [
            {
                chainId: '0x507'
            }
        ]
    },
    addAstarNetwork: {
        method: 'wallet_addEthereumChain',
        params: [
            {
                chainId: '0x250',
                rpcUrls: ['https://evm.shibuya.astar.network'],
                chainName: 'Astar',
                nativeCurrency: {name: 'ASTR', decimals: 18, symbol: 'ASTR'},
                blockExplorerUrls: ['https://blockscout.com/astar']
            }
        ]
    },
    switchToAstarNetwork: {
        method: 'wallet_switchEthereumChain',
        params: [
            {
                chainId: '0x250' // 592
            }
        ]
    },
    addShidenNetwork: {
        method: 'wallet_addEthereumChain',
        params: [
            {
                chainId: '0x150', // 336
                rpcUrls: ['https://evm.shibuya.astar.network'],
                chainName: 'Shiden',
                nativeCurrency: {name: 'SDN', decimals: 18, symbol: 'SDN'},
                blockExplorerUrls: ['https://blockscout.com/astar']
            }
        ]
    },
    switchToShidenNetwork: {
        method: 'wallet_switchEthereumChain',
        params: [
            {
                chainId: '0x150'
            }
        ]
    },
    addShibuyaNetwork: {
        method: 'wallet_addEthereumChain',
        params: [
            {
                chainId: '0x51',
                rpcUrls: ['https://evm.shibuya.astar.network'],
                chainName: 'Shibuya Testnet',
                nativeCurrency: {name: 'SBY', decimals: 18, symbol: 'SBY'},
                blockExplorerUrls: ['https://blockscout.com/shibuya']
            }
        ]
    },
    switchToShibuyaNetwork: {
        method: 'wallet_switchEthereumChain',
        params: [
            {
                chainId: '0x51' // 81
            }
        ]
    },
    getPermissions: {
        method: 'wallet_getPermissions',
        params: [{eth_accounts: {}}]
    },
    requestPermissions: {
        method: 'wallet_requestPermissions',
        params: [{eth_accounts: {}}]
    }
}

export const CHAIN_ID_MAPPING = {
    '0x507': 'Moonbase Alpha',
    '507': 'Moonbase Alpha',
    '0x504': 'Moonbeam',
    '504': 'Moonbeam',
}

export const PROVIDER_NAME = {
    SubWallet: "SubWallet",
    MetaMask: "ethereum"
}

export const EVM_WALLETS = [
    {
        extensionName: 'SubWallet',
        title: 'SubWallet (EVM)',
        installUrl: 'https://subwallet.app/download.html',
        logo: {
            src: SubWalletLogo ,
            alt: 'SubWallet (EVM)'
        },
        isSetGlobalString: 'isSubWallet',
        initEvent: 'subwallet#initialized',
        isMobileSupport: false
    },
    {
        extensionName: 'ethereum',
        title: 'MetaMask',
        installUrl: 'https://metamask.io/download/',
        logo: {
            src: MetaMaskLogo,
            alt: 'MetaMask Extension'
        },
        isSetGlobalString: 'isMetaMask',
        initEvent: 'ethereum#initialized',
        isMobileSupport: true
    }
];


export const SUBWALLET_EXT_URL = "https://bit.ly/3BGqFt1"
export const METAMASK_EXT_URL = "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"

export const NFT_SALE_INFO = {
    R1: {
        amount: 500,
        price: 79,
        nftPerPass: 1,
    },
    R2: {
        amount: 1500,
        price: 119,
        nftPerPass: 2,
    },
    R3: {
        amount: 3000,
        price: 159,
        nftPerPass: 3,
    }
}