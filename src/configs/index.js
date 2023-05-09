import BigNumber from 'bignumber.js'
import {getReactEnv} from "../utils/env"

const getConfigs = () => {
    const env = getReactEnv('ENV')
    const config = {
        API_URL: 'https://api-dev.moonfit.xyz/v1',
        APP_URI: window.location.host,

        MOONBEAST_NETWORK: 'https://rpc.api.moonbase.moonbeam.network/',
        MOONBEAM_WSS_URL: 'wss://wss.api.moonbase.moonbeam.network',
        MOONBEAM_SCAN_URL: 'https://moonbase.moonscan.io',
        MOONBEAM_NFTSCAN_URL: 'https://moonbase.moonscan.io',
        MINT_PASS_SC: '0x7E7d9fee5c5994aA7FC1dAeb231Af015e2FdAD3E',
        MOONBEAST_SC: '0x368a1BBED5Ca2984b0867109e0aeB2B6fAD3B17A',
        R1_NFT_SALE_SC: '0xdfE0a818579B1e5271c0E3597E1D79E83690d3D6',
        R2_NFT_SALE_SC: '0x9C447072B4fA1BfAE661ecA8db4924565596f39C',
        WC_NFT_SALE_SC: '0x3eD95De9256dB0Bd5934dAa27c2D8E4c08f6419e',
        R34_NFT_SALE_SC: '0x0aF2B7675C8B6d6C60A8a0ED6C6Bc24E6f08a225',
    }

    switch (env) {
        case 'local':
            return {
                ...config,
                env: 'local',
                API_URL: 'http://0.0.0.0:8081/v1',
                APP_URI: window.location.host,
            }
        case 'production':
            return {
                API_URL: 'https://api-prod.moonfit.xyz/v1',
                APP_URI: window.location.host,
                env: 'production',

                MOONBEAST_NETWORK: 'https://rpc.api.moonbeam.network/',
                MOONBEAM_WSS_URL: 'wss://wss.api.moonbeam.network',
                MOONBEAM_SCAN_URL: 'https://moonscan.io',
                MOONBEAM_NFTSCAN_URL: 'https://moonbeam.nftscan.com',
                MINT_PASS_SC: '0x6758053c0b27E478edE1E4882adFF708Fc4FA72D',
                MOONBEAST_SC: '0x02A6DeC99B2Ca768D638fcD87A96F6069F91287c',
                R1_NFT_SALE_SC: '0x1Cc5d866BdbD9b3Fd9d22493D29Da3D5cA97b174',
                R2_NFT_SALE_SC: '0x775282a995ac37410Bbc053a91bc01221a71c50f',
                WC_NFT_SALE_SC: '0x5c0101b04F2b7dc186356e4cd934855db658eEf4',
                R34_NFT_SALE_SC: '',
            }
        case 'development':
        default:
            return {
                ...config,
                env: 'development',
            }
    }
}

export const BIG_NUMBER_FORMAT = {
    prefix: '',
    decimalSeparator: ',',
    groupSeparator: '.',
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0,
    suffix: ''
}

BigNumber.config({ FORMAT: BIG_NUMBER_FORMAT })

const env = getConfigs()

window.__env = env

export default env
