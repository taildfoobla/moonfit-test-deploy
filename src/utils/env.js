export const getReactEnv = (name) => {
    const env = process.env[`REACT_APP_${name}`] || 'production'

    console.log(env)

    return env
}
