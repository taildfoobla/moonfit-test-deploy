export const getReactEnv = (name) => {
    return process.env[`REACT_APP_${name}`] || 'production'
}
