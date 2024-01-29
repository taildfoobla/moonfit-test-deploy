import { getReactEnv } from "../helpers/env"

const getConfigs = () => {
    const env = getReactEnv('ENV')
    switch (env) {
        case 'development':
            return {
                TWITTER_AUTH: 'https://twitter.com/i/oauth2/authorize?response_type=code&client_id=NUNJY29TcGNSd25MQk9mRU40MGM6MTpjaQ&redirect_uri=https://dev-event.moonfit.xyz/twitter&scope=tweet.read%20users.read%20follows.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain',
                DISCORD_AUTH: 'https://discord.com/api/oauth2/authorize?client_id=1018789511104303136&redirect_uri=https%3A%2F%2Fdev-event.moonfit.xyz%2Fdiscord%2F&response_type=token&scope=identify%20guilds.members.read%20guilds.join%20guilds',
                GOOGLE_FORM: 'https://bit.ly/Weekly-Raffle-Winners'
            }
        case 'production':
            return {
                TWITTER_AUTH: 'https://twitter.com/i/oauth2/authorize?response_type=code&client_id=NUNJY29TcGNSd25MQk9mRU40MGM6MTpjaQ&redirect_uri=https://event.moonfit.xyz/twitter&scope=tweet.read%20users.read%20follows.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain',
                DISCORD_AUTH: 'https://discord.com/api/oauth2/authorize?client_id=1018789511104303136&redirect_uri=https%3A%2F%2Fevent.moonfit.xyz%2Fdiscord%2F&response_type=token&scope=identify%20guilds.join%20guilds%20guilds.members.read',
                GOOGLE_FORM: 'https://bit.ly/Weekly-Raffle-Winners'
            }
        default:
            return {
                TWITTER_AUTH: 'https://twitter.com/i/oauth2/authorize?response_type=code&client_id=NUNJY29TcGNSd25MQk9mRU40MGM6MTpjaQ&redirect_uri=https://dev-event.moonfit.xyz/twitter&scope=tweet.read%20users.read%20follows.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain',
                DISCORD_AUTH: 'https://discord.com/api/oauth2/authorize?client_id=1018789511104303136&redirect_uri=https%3A%2F%2Fdev-event.moonfit.xyz%2Fdiscord%2F&response_type=token&scope=identify%20guilds%20guilds.join%20guilds.members.read',
                GOOGLE_FORM: 'https://bit.ly/Weekly-Raffle-Winners'
            }
    }
}

export const THIRD_PARTY_AUTH = getConfigs()