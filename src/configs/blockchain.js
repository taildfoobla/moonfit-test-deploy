import {getReactEnv} from "../utils/env"

const getConfigs = () => {
    const env = getReactEnv('ENV')
    switch (env) {
        case 'development':
            return {
                MOONBEAM_SCAN_URL: 'https://moonbase.moonscan.io',
                MINT_PASS_SC: '0x7E7d9fee5c5994aA7FC1dAeb231Af015e2FdAD3E',
                R1_NFT_SALE_SC: '0xcd176d741E211B63Ee6bBB5241FF51a09Dd5FbFC',
                MOONBEAST_SC: '0x86A7f77bFaB7cd5676485D10A7196DEfF453B11b',
            }
        case 'production':
            return {
                MOONBEAM_SCAN_URL: 'https://moonscan.io',
                MINT_PASS_SC: '0x6758053c0b27E478edE1E4882adFF708Fc4FA72D',
                R1_NFT_SALE_SC: '0x9Ea9fff918Fd3f150997A1F53cf407bb2aF844b5',
                MOONBEAST_SC: '0x837A5E6DCe7B0fcC36DCf03a9b955D02aa856c08',
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