import {getReactEnv} from "../helpers/env"

const getConfigs = () => {
    const env = getReactEnv('ENV')
    switch (env) {
        case 'local':
            return {
                API_URL: 'http://0.0.0.0:8081/v1',
                API_URL_v1: 'http://0.0.0.0:8081/v1',
                API_APP_URI: 'https://api-prod.moonfit.xyz/v1/',
                // APP_URI: 'dev-event.moonfit.xyz',
                APP_URI:'https://dev-app.moonfit.xyz/'
            }
        case 'development':
            return {
                // API_URL: 'https://raffle-game-dev-api.moonfit.xyz',
                API_URL: 'https://api-dev.moonfit.xyz/v1',
                // API_URL_EVENT:"https://raffle-game-api.moonfit.xyz",
                API_URL_EVENT:"https://raffle-game-dev-api.moonfit.xyz",
                // API_URL_EVENT:"http://localhost:1337/",
                API_URL_v1: 'https://api-dev.moonfit.xyz/v1/',
                API_APP_URI: 'https://api-dev.moonfit.xyz/v1/',
                // APP_URI: 'dev-event.moonfit.xyz',
                APP_URI:'https://dev-app.moonfit.xyz/',
                CYBER_ACCOUNT_KEY:'vbdgMuy5TW4siHfK0kNvzDotyVizwg6I',
                MOON_BEAM_RPC:'https://rpc.api.moonbase.moonbeam.network/'
            }

        case 'staging':
            return {
                API_URL: 'https://raffle-game-dev-api.moonfit.xyz',
                API_URL_v1: 'https://api-dev.moonfit.xyz/v1/',
                API_APP_URI: 'https://api-dev.moonfit.xyz/v1/',
                // APP_URI: 'dev-event.moonfit.xyz'
                APP_URI:'https://dev-app.moonfit.xyz/',
            }
        case 'production':
            return {
                API_URL: 'https://api-dev.moonfit.xyz/v1/',
                API_URL_EVENT:"https://raffle-game-api.moonfit.xyz",
                API_APP_URI: 'https://api-prod.moonfit.xyz/v1/',
                APP_URI: 'event.moonfit.xyz',
                CYBER_ACCOUNT_KEY:'1jlvqWJqnPUFS720L0hcHDQq8nIRl7KW',
                MOON_BEAM_RPC:'https://rpc.api.moonbeam.network/'
            }
        default:
            return {
                API_URL: 'https://api-dev.moonfit.xyz/v1/',
                API_URL_EVENT:"https://raffle-game-api.moonfit.xyz",
                API_URL_v1: 'https://api-dev.moonfit.xyz/v1/',
                API_APP_URI: 'https://api-dev.moonfit.xyz/v1/',
                // APP_URI: 'dev-event.moonfit.xyz'
                APP_URI:'https://dev-app.moonfit.xyz/',
            }
    }
}

export const COMMON_CONFIGS = getConfigs()
