import {getReactEnv} from "../utils/env"

const getConfigs = () => {
    const env = getReactEnv('ENV')
    switch (env) {
        case 'development':
            return {
                MOONBEAM_SCAN_URL: 'https://moonbase.moonscan.io',
                MINT_PASS_SC: '0xDfc960fA54135929a0c6678998944113D37F843A'
            }
        case 'production':
            return {
                MOONBEAM_SCAN_URL: 'https://moonscan.io',
                MINT_PASS_SC: '0x6758053c0b27E478edE1E4882adFF708Fc4FA72D'
            }
        default:
            return {
                MOONBEAM_SCAN_URL: 'https://moonbase.moonscan.io',
                MINT_PASS_SC: '0xFBd179FEA1F1736bFdDC9Cd63Ca52D9fAbf497C3'
            }
    }
}

export const BLC_CONFIGS = getConfigs()