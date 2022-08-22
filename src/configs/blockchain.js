import {getReactEnv} from "../utils/env"

const getConfigs = () => {
    const env = getReactEnv('ENV')
    switch (env) {
        case 'development':
            return {
                MOONBEAM_SCAN_URL: 'https://moonbase.moonscan.io',
                MINT_PASS_SC: '0x7E7d9fee5c5994aA7FC1dAeb231Af015e2FdAD3E',
                // R1_NFT_SALE_SC: '0xcd176d741E211B63Ee6bBB5241FF51a09Dd5FbFC',
                R1_NFT_SALE_SC: '0xdfE0a818579B1e5271c0E3597E1D79E83690d3D6',
                // MOONBEAST_SC: '0x86A7f77bFaB7cd5676485D10A7196DEfF453B11b',
                MOONBEAST_SC: '0x368a1BBED5Ca2984b0867109e0aeB2B6fAD3B17A',
            }
        case 'production':
            return {
                MOONBEAM_SCAN_URL: 'https://moonscan.io',
                MINT_PASS_SC: '0x6758053c0b27E478edE1E4882adFF708Fc4FA72D',
                R1_NFT_SALE_SC: '0xE7DF5baceC40611Ce43cE7B1dE6D9e777414985B',
                MOONBEAST_SC: '0x02A6DeC99B2Ca768D638fcD87A96F6069F91287c',
            }
        default:
            return {
                MOONBEAM_SCAN_URL: 'https://moonbase.moonscan.io',
                MINT_PASS_SC: '0xFBd179FEA1F1736bFdDC9Cd63Ca52D9fAbf497C3',
                R1_NFT_SALE_SC: '0x3F0f0a63D332024682FE06642de31c7016826941',
                MOONBEAST_SC: '0x21d95dAC89c5665F31777E3f9aF2A997dAc4eCF7',
            }
    }
}

export const BLC_CONFIGS = getConfigs()