import {getReactEnv} from "../utils/env"

const getConfigs = () => {
    const env = getReactEnv('ENV')
    const config = {
        API_URL: 'https://api-dev.moonfit.xyz/v1',
        APP_URI: 'dev-app.moonfit.xyz',

        MOONBEAST_NETWORK: 'https://rpc.api.moonbase.moonbeam.network/',
        MOONBEAM_SCAN_URL: 'https://moonbase.moonscan.io',
        MOONBEAM_NFTSCAN_URL: 'https://moonbase.moonscan.io',
        MINT_PASS_SC: '0x7E7d9fee5c5994aA7FC1dAeb231Af015e2FdAD3E',
        R1_NFT_SALE_SC: '0xdfE0a818579B1e5271c0E3597E1D79E83690d3D6',
        R2_NFT_SALE_SC: '0x9C447072B4fA1BfAE661ecA8db4924565596f39C',
        R3_NFT_SALE_SC: '0x0038FA8a9fD0AcE4965F64C173ce28c85Ae6d0A0',
        R4_NFT_SALE_SC: '0x221925BAD6B9E4Bc064fF296D2b70f5CE2F84111',
        MOONBEAST_SC: '0x368a1BBED5Ca2984b0867109e0aeB2B6fAD3B17A',
    }

    switch (env) {
        case 'local':
            return {
                ...config,
                env: 'local',
                API_URL: 'http://0.0.0.0:8081/v1',
                APP_URI: 'localhost:3000',
            }
        case 'production':
            return {
                API_URL: 'https://api-prod.moonfit.xyz/v1',
                APP_URI: 'app.moonfit.xyz',
                env: 'production',

                MOONBEAST_NETWORK: 'https://rpc.api.moonbeam.network/',
                MOONBEAM_SCAN_URL: 'https://moonscan.io',
                MOONBEAM_NFTSCAN_URL: 'https://moonbeam.nftscan.com',
                MINT_PASS_SC: '0x6758053c0b27E478edE1E4882adFF708Fc4FA72D',
                R1_NFT_SALE_SC: '0x1Cc5d866BdbD9b3Fd9d22493D29Da3D5cA97b174',
                R2_NFT_SALE_SC: '0x775282a995ac37410Bbc053a91bc01221a71c50f',
                R3_NFT_SALE_SC: '',
                R4_NFT_SALE_SC: '',
                MOONBEAST_SC: '0x02A6DeC99B2Ca768D638fcD87A96F6069F91287c',
            }
        case 'development':
        default:
            return {
                ...config,
                env: 'development',
            }
    }
}

const env = getConfigs()

window.__env = env

export default env
