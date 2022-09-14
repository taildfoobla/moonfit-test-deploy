export const getReactEnv = (name, defaultReturn = null) => {
    return process.env[`REACT_APP_${name}`] || 'production'
}