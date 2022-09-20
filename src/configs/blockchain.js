import {getReactEnv} from "../utils/env"

const getConfigs = () => {
    const env = getReactEnv('ENV')
    switch (env) {
        case 'production':
            return {
                MOONBEAST_NETWORK: 'https://rpc.api.moonbeam.network/',
                MOONBEAM_SCAN_URL: 'https://moonscan.io',
                MINT_PASS_SC: '0x6758053c0b27E478edE1E4882adFF708Fc4FA72D',
                R1_NFT_SALE_SC: '0x1Cc5d866BdbD9b3Fd9d22493D29Da3D5cA97b174',
                R2_NFT_SALE_SC: '',
                R3_NFT_SALE_SC: '',
                R4_NFT_SALE_SC: '',
                MOONBEAST_SC: '0x02A6DeC99B2Ca768D638fcD87A96F6069F91287c',
            }
        case 'development':
        default:
            return {
                MOONBEAST_NETWORK: 'https://rpc.api.moonbase.moonbeam.network/',
                MOONBEAM_SCAN_URL: 'https://moonbase.moonscan.io',
                MINT_PASS_SC: '0x7E7d9fee5c5994aA7FC1dAeb231Af015e2FdAD3E',
                // R1_NFT_SALE_SC: '0xcd176d741E211B63Ee6bBB5241FF51a09Dd5FbFC',
                R1_NFT_SALE_SC: '0xdfE0a818579B1e5271c0E3597E1D79E83690d3D6',
                R2_NFT_SALE_SC: '0x67191ed7594dB7C23879EBA2F8E0817203cc2657',
                R3_NFT_SALE_SC: '',
                R4_NFT_SALE_SC: '',
                MOONBEAST_SC: '0x368a1BBED5Ca2984b0867109e0aeB2B6fAD3B17A',
            }
    }
}

export const BLC_CONFIGS = getConfigs()
