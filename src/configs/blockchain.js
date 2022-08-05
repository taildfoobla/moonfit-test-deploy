import {getReactEnv} from "../utils/env"

const getConfigs = () => {
    const env = getReactEnv('ENV')
    switch (env) {
        case 'development':
            return {
                MOONBEAM_SCAN_URL: 'https://moonbase.moonscan.io',
                MINT_PASS_SC: '0x7E7d9fee5c5994aA7FC1dAeb231Af015e2FdAD3E',
                R1_NFT_SALE_SC: '0x9676D390E28D6d00aA8Cc666E3ad52E974B2e4E3',
                MOONBEAST_SC: '0x21d95dAC89c5665F31777E3f9aF2A997dAc4eCF7',
            }
        case 'production':
            return {
                MOONBEAM_SCAN_URL: 'https://moonscan.io',
                MINT_PASS_SC: '0x6758053c0b27E478edE1E4882adFF708Fc4FA72D',
                R1_NFT_SALE_SC: '0x3F0f0a63D332024682FE06642de31c7016826941',
                MOONBEAST_SC: '0x21d95dAC89c5665F31777E3f9aF2A997dAc4eCF7',
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