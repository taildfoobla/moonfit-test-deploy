import {Buffer} from 'buffer';
import configs from '../configs'
import MetaMaskLogo from '../assets/images/wallets/MetaMaskLogo.svg';
import SubWalletLogo from '../assets/images/wallets/SubWalletLogo.svg';
import WalletConnectLogo from '../assets/images/wallets/WalletConnectLogo.svg';

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
            src: SubWalletLogo,
            alt: 'SubWallet (EVM)'
        },
        isSetGlobalString: 'isSubWallet',
        initEvent: 'subwallet#initialized',
        isMobileSupport: true
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

export const WALLET_CONNECT = {
    title: 'Wallet Connect',
    logo: {
        src: WalletConnectLogo,
        alt: 'Wallet Connect'
    },
}

const isDev = configs.env === 'development'
const isTestnet = configs.env === 'development'

export const NFT_SALE_ROUNDS_INFO = {
    R1: {
        index: 1,
        number: 1,
        title: 'NFT Sale 1',
        timelineTitle: 'Whitelist Sale #1',
        isSoldOut: true,
        activeSoldOut: false,
        soldOutMsg: 'Sold out in 30 minutes',
        fromTokenID: 1,
        amount: 500,
        price: 79,
        mintPass: 1,
        nftPerPass: 1,
        description: '',
        dateMsg: '22nd August',
        time: 1661176800000, // Date and time (GMT): Monday, August 22, 2022 2:00:00 PM
        specialRound: false
    },
    R2: {
        index: 2,
        number: 2,
        title: 'NFT Sale 2',
        timelineTitle: 'Whitelist Sale #2',
        isSoldOut: true,
        activeSoldOut: false,
        NFT_SALE_SC: configs.R2_NFT_SALE_SC,
        amount: 1500,
        fromTokenID: 501,
        price: 119,
        mintPass: 1,
        nftPerPass: 2,
        description: 'Buy max 2 MoonBeasts per MintPass',
        dateMsg: '24th September',
        time: 1664028000000, // Date and time (GMT): Saturday, September 24, 2022 2:00:00 PM,
        specialRound: false
    },
    WC: {
        index: 3,
        number: 5,
        headerTitle: 'World cup 2022',
        title: 'SPECIAL EDITION',
        timelineTitle: 'World cup Sale',
        isSoldOut: true,
        activeSoldOut: false,
        NFT_SALE_SC: configs.WC_NFT_SALE_SC,
        amount: 19,
        fromTokenID: 2001,
        price: 399,
        mintPass: 0,
        nftPerPass: null,
        description: 'No MintPass required',
        dateMsg: '25th November',
        // expireDate: '2022-12-12',
        dateRange: 'nov 25 - dec 12',
        eventUpdateSaleAmountName: 'WorldCupUpdateSaleAmount',
        time: 1665583200000, // Date and time (GMT): Wednesday, October 12, 2022 2:00:00 PM
        ...(isDev ? {
            time: Date.now(),
            price: 0.00399,
        } : {}),
        specialRound: true
    },
    R3: {
        index: 4,
        number: 3,
        title: 'NFT Sale 3',
        timelineTitle: 'Whitelist Sale #3',
        isSoldOut: false,
        activeSoldOut: true,
        NFT_SALE_SC: configs.R34_NFT_SALE_SC,
        amount: 7981,
        bound: 300,
        fromTokenID: 2020,
        lastTokenId: 10000,
        price: 119,
        mintPass: 1,
        nftPerPass: 1,
        description: 'Buy max 1 Moonbeast with discounted price per Mintpass',
        dateMsg: '01st April',
        eventUpdateSaleAmountName: 'R3UpdateSaleAmount',
        time: 1665583200000,
        specialRound: false,
        ...(isDev ? {
            fromTokenID: 6119,
        } : {}),
    },
}

export const NFT_SALE_CURRENT_INFO = {
    ...NFT_SALE_ROUNDS_INFO.R3,
}


/**
 * @param item
 * @returns {NetworkConfig}
 */
function mappingConfigNetwork(item) {
    return {
        ...item,
        isTestnet: !!item.isTestnet,
        symbolIcon: `${configs.IMAGE_CDN_URL}/image/original/assets/icons/${item.symbol}.png`,
        chainIcon: `${configs.IMAGE_CDN_URL}/image/original/assets/icons/${item.symbol}.png`,
    }
}

const NETWORKS = [
    {
        chainId: 1287,
        chainHex: '0x507',
        digit: 2,
        currencyDecimal: 18,
        networkName: 'Moonbase Alpha',
        symbol: 'GLMR',
        currencySymbol: 'DEV',
        isTestnet: true,
        scan: 'https://moonbase.moonscan.io',
        rpc: 'https://rpc.api.moonbase.moonbeam.network',
        wss: 'wss://wss.api.moonbase.moonbeam.network',
        _name: 'base_token',
        symbolDisplay: 'GLMR',
        MINT_PASS_ADDRESS: '0x7E7d9fee5c5994aA7FC1dAeb231Af015e2FdAD3E',
        MOON_BEAST_ADDRESS: '0x368a1BBED5Ca2984b0867109e0aeB2B6fAD3B17A',
        MASTER_ADDRESS: '0xDE485A49e1dde6Ce2e9e77782Be664ECF1Fec2cF',
        GATEWAY_ADDRESS: '0x728d879c8F0951D9E79bf189D0EDb4f1ea2C0B77',
    },
    {
        chainId: 1284,
        chainHex: '0x504',
        digit: 2,
        currencyDecimal: 18,
        networkName: 'Moonbeam',
        symbol: 'GLMR',
        currencySymbol: 'GLMR',
        scan: 'https://moonbeam.moonscan.io',
        rpc: 'https://rpc.api.moonbeam.network',
        wss: 'wss://wss.api.moonbeam.network',
        _name: 'base_token',
        symbolDisplay: 'GLMR',
        MINT_PASS_ADDRESS: '0x6758053c0b27E478edE1E4882adFF708Fc4FA72D',
        MOON_BEAST_ADDRESS: '0x02A6DeC99B2Ca768D638fcD87A96F6069F91287c',
        MASTER_ADDRESS: '0xc7e929d05e52f62c3aa2bd180983fa2bf0abcc54',
        GATEWAY_ADDRESS: '0x728d879c8F0951D9E79bf189D0EDb4f1ea2C0B77',
    },
    {
        chainId: 97,
        chainHex: '0x61',
        digit: 6,
        currencyDecimal: 18,
        networkName: 'Binance Smart Chain Testnet',
        symbol: 'BNB',
        currencySymbol: 'BNB',
        isTestnet: true,
        scan: 'https://testnet.bscscan.com',
        rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
        wss: 'wss://testnet-dex.binance.org/api/',
        _name: 'bnb_token',
        symbolDisplay: 'BNB',
        MINT_PASS_ADDRESS: '',
        MOON_BEAST_ADDRESS: '0x67133a5a24aa7C5b5663767A34Fc24eBB4b9319E',
        MASTER_ADDRESS: '0xe9B61a2Be11E8376d69dCEf8aB2d7a04887AbeBf',
        GATEWAY_ADDRESS: '0x06CdFe37Eb3E72588dBadd540cC145547168977C',
    },
    {
        chainId: 56,
        chainHex: '0x38',
        digit: 6,
        currencyDecimal: 18,
        networkName: 'Binance Smart Chain Mainnet',
        symbol: 'BNB',
        currencySymbol: 'BNB',
        scan: 'https://bscscan.com',
        rpc: 'https://bsc-dataseed.binance.org',
        wss: 'wss://dex.binance.org/api/',
        _name: 'bnb_token',
        symbolDisplay: 'BNB',
        MINT_PASS_ADDRESS: '',
        MOON_BEAST_ADDRESS: '',
        MASTER_ADDRESS: '',
        GATEWAY_ADDRESS: '',
    },
    {
        chainId: 81,
        chainHex: '0x51',
        digit: 4,
        currencyDecimal: 18,
        networkName: 'Shibuya Network',
        symbol: 'ASTR',
        currencySymbol: 'SBY',
        isTestnet: true,
        scan: 'https://shibuya.subscan.io',
        rpc: 'https://evm.shibuya.astar.network',
        wss: 'wss://rpc.shibuya.astar.network',
        _name: 'astar_token',
        symbolDisplay: 'ASTR',
        MINT_PASS_ADDRESS: '',
        MOON_BEAST_ADDRESS: '0x4c1E5Be87E24bb3d6f77AD59a41BCba7B5249Fa9',
        MASTER_ADDRESS: '0xe9B8A0D9D2e5be3158c5AB97182AeF9b1402562D',
        GATEWAY_ADDRESS: '0x5e9c6c7c60C4Ae4f383a9E3385E445E3F2400d45', // MintBurnGateway
    },
    {
        chainId: 592,
        chainHex: '0x250',
        digit: 4,
        currencyDecimal: 18,
        networkName: 'Astar Network Mainnet',
        symbol: 'ASTR',
        currencySymbol: 'ASTR',
        scan: 'https://blockscout.com/astar',
        rpc: 'https://astar.public.blastapi.io',
        wss: 'wss://rpc.astar.network',
        _name: 'astar_token',
        symbolDisplay: 'ASTR',
        MINT_PASS_ADDRESS: '',
        MOON_BEAST_ADDRESS: '0x45eC4aCEfd18cC78Ad1f25f6D5Bf8180753A7000',
        MASTER_ADDRESS: '0x166Bb513B431524fAAAaE7F7820EC188A8e1874A',
        GATEWAY_ADDRESS: '',
    },
    {
        chainId: 3441005,
        chainHex: '0x34816d',
        digit: 5,
        currencyDecimal: 18,
        networkName: 'Manta Pacific Testnet',
        symbol: 'MANTA_ETH',
        currencySymbol: 'ETH',
        scan: 'https://pacific-explorer.testnet.manta.network',
        rpc: 'https://pacific-rpc.testnet.manta.network/http',
        wss: 'wss://pacific-rpc.testnet.manta.network/ws',
        isTestnet: true,
        _name: 'manta_token',
        symbolDisplay: 'ETH (MANTA)',
        MINT_PASS_ADDRESS: '',
        MOON_BEAST_ADDRESS: '',
        MASTER_ADDRESS: '0x73578e16F4E495DE5e8f2CD7927d5d77C1B65446',
    },
    {
        chainId: 169,
        chainHex: '0x361',
        digit: 5,
        currencyDecimal: 18,
        networkName: 'Manta Pacific',
        symbol: 'MANTA_ETH',
        currencySymbol: 'ETH',
        scan: 'https://pacific-explorer.manta.network',
        rpc: 'https://pacific-rpc.manta.network/http',
        wss: 'wss://pacific-rpc.manta.network/ws',
        _name: 'manta_token',
        symbolDisplay: 'ETH (MANTA)',
        MINT_PASS_ADDRESS: '',
        MOON_BEAST_ADDRESS: '',
        MASTER_ADDRESS: '',
    },
].map(mappingConfigNetwork)
    .filter(item => item.isTestnet === isTestnet)

/**
 * @type {NetworkConfig}
 */
export const moonBeamNetwork = NETWORKS.find(item => item.symbol === 'GLMR' && item.isTestnet === isTestnet)

/**
 * @type {NetworkConfig}
 */
export const binanceNetwork = NETWORKS.find(item => item.symbol === 'BNB' && item.isTestnet === isTestnet)

/**
 * @type {NetworkConfig}
 */
export const astarNetwork = NETWORKS.find(item => item.symbol === 'ASTR' && item.isTestnet === isTestnet)
/**
 * @type {NetworkConfig}
 */
export const mantaNetwork = NETWORKS.find(item => item.symbol === 'MANTA_ETH' && item.isTestnet === isTestnet)

export const findNetworkFromSymbol = symbol => NETWORKS.find(item => item.symbol === symbol && item.isTestnet === isTestnet)


export const WEB3_METHODS = {
    requestAccounts: {
        method: 'eth_requestAccounts'
    },
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
                chainId: moonBeamNetwork.chainHex,
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
    },
    switchToChainId(chainId) {
        const network = NETWORKS.find(item => item.chainId === chainId) || {}
        return {
            method: 'wallet_switchEthereumChain',
            params: [
                {
                    chainId: network.chainHex,
                }
            ]
        }
    },
    addToChainId(chainId) {
        const network = NETWORKS.find(item => item.chainId === chainId) || {}
        console.log(network);
        return {
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: network.chainHex,
                    rpcUrls: [network.rpc],
                    chainName: network.networkName,
                    nativeCurrency: {name: network.networkName, decimals: network.currencyDecimal, symbol: network.currencySymbol},
                    blockExplorerUrls: [network.scan]
                }
            ]
        }
    },
}

export const CHAIN_ID_MAPPING = {
    '0x507': 'Moonbase Alpha',
    '507': 'Moonbase Alpha',
    '1287': 'Moonbase Alpha',

    '0x504': 'Moonbeam',
    '504': 'Moonbeam',
    '1284': 'Moonbeam',

    '97': 'Binance Smart Chain Testnet',
    '0x61': 'Binance Smart Chain Testnet',

    '81': 'Shibuya Network',
    '0x51': 'Shibuya Network',

    '592': 'Astar Network Mainnet',
    '0x250': 'Astar Network Mainnet',

    '3441005': 'Manta Pacific Testnet',
    '0x34816d': 'Manta Pacific Testnet',

    '169': 'Manta Pacific Mainnet',
    '0x361': 'Manta Pacific Mainnet',
}
export const SUPPORTED_NETWORKS = [
    ...NETWORKS.map(item => {
        return {
            name: item.networkName,
            short_name: item.networkName,
            chain: item.networkName,
            network: item.isTestnet ? 'testnet' : 'mainnet',
            chain_id: item.chainId,
            network_id: item.chainId,
            rpc_url: item.rpcUrl,
            scan_url: item.scan,
            native_currency: {
                symbol: item.symbol,
                name: item.symbolName || item.symbol,
                decimals: item.currencyDecimal,
                contractAddress: "",
                balance: "",
            },
        }
    })
];


export const getPersonalSignMessage = (message) => {
    return `0x${Buffer.from(message, 'utf8').toString('hex')}`
}
