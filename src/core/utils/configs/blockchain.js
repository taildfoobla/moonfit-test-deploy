import { getReactEnv } from "../helpers/env"

const getConfigs = () => {
    const env = getReactEnv('ENV')
    switch (env) {
        case 'development':
            return {
                MOONBEAM_SCAN_URL: 'https://moonbase.moonscan.io',
                MOONBEAM_WSS_URL: 'wss://wss.api.moonbase.moonbeam.network',
                RPC_URL: 'https://rpc.api.moonbase.moonbeam.network',
                MFG_SC: '0x3ef88816ebE8F50019e931bdFFB0e428A44a29B1',
                MFR_SC: '0xc2bFd8e028b342F0537aDC2bF310821c807c1312',
                MINT_PASS_SC: '0x7E7d9fee5c5994aA7FC1dAeb231Af015e2FdAD3E',
                R1_NFT_SALE_SC: '0x0Cc26aEBa06dCd61Ef67D97c1689c000079660BB',
                MOONBEAST_SC: '0x368a1BBED5Ca2984b0867109e0aeB2B6fAD3B17A',
                MOONBOX_SC: '',
                MOONEGG_SC: '',
                MOONITEM_SC: '',
            }
        case 'production':
        default:
            return {
                MOONBEAM_SCAN_URL: 'https://moonscan.io',
                RPC_URL: 'https://rpc.api.moonbeam.network',
                MOONBEAM_WSS_URL: 'wss://wss.api.moonbeam.network',
                MFG_SC: '',
                MFR_SC: '',
                MINT_PASS_SC: '0x6758053c0b27E478edE1E4882adFF708Fc4FA72D',
                R1_NFT_SALE_SC: '0x1Cc5d866BdbD9b3Fd9d22493D29Da3D5cA97b174',
                MOONBEAST_SC: '0x02A6DeC99B2Ca768D638fcD87A96F6069F91287c',
                MOONBOX_SC: '',
                MOONEGG_SC: '',
                MOONITEM_SC: '',
            }
    }
}

export const BLC_CONFIGS = getConfigs()
