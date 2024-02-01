const getChainData = (env) => {
    switch (env) {
        case "production":
            return [
                {name: "moonbeam", chainId: 1284},
                {
                    name: "astar",
                    chainId: 592,
                },
            ]
        case "development":
            return [
                {name: "moonbeam", chainId: 1287},
                {
                    name: "astar",
                    chainId: 81,
                },
            ]
        default:
            return [
                {name: "moonbeam", chainId: 1284},
                {
                    name: "astar",
                    chainId: 592,
                },
            ]
    }
}
const env = process.env.REACT_APP_ENV
export const chainData = getChainData(env)

