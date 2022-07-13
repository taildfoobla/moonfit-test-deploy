import {getReactEnv} from "../utils/env"

const getConfigs = () => {
    const env = getReactEnv('ENV')
    switch (env) {
        case 'development':
            return {
                MOONBEAM_SCAN_URL: 'https://moonbase.moonscan.io',
                MINT_PASS_SC: '0xFBd179FEA1F1736bFdDC9Cd63Ca52D9fAbf497C3'
            }
        case 'production':
            return {
                MOONBEAM_SCAN_URL: 'https://moonscan.io',
                MINT_PASS_SC: '0xFBd179FEA1F1736bFdDC9Cd63Ca52D9fAbf497C3'
            }
        default:
            return {
                MOONBEAM_SCAN_URL: 'https://moonbase.moonscan.io',
                MINT_PASS_SC: '0xFBd179FEA1F1736bFdDC9Cd63Ca52D9fAbf497C3'
            }
    }
}

export const BLC_CONFIGS = getConfigs()