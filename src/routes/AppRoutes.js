import Paths from "./Paths"

export const AppRoutes = [
    // {
    //     path: Paths.Home.path,
    //     title: "Home",
    //     external: false,
    //     env: Paths.Home.env
    // },
    {
        path: Paths.MintPassMinting.path,
        title: "Mint Pass",
        external: false,
        env: Paths.MintPassMinting.env
    },
    {
        path: Paths.NFTSaleRoundThree.path,
        title: "NFT Sale",
        external: false,
        env: Paths.NFTSaleRoundThree.env,
        actives: [
            Paths.NFTSaleRoundThree.path,
        ]
    },
    {
        path: Paths.Deposit.path,
        title: "Deposit Into App",
        external: false,
        env: Paths.Deposit.env,
        actives: [
            Paths.Deposit.path,
        ]
    },
    // {
    //     path: Paths.MintPassVerify.path,
    //     title: "Mint Pass Verify",
    //     external: false,
    //     env: Paths.MintPassVerify.env
    // },
    {
        path: Paths.PrivateSale.path,
        title: "MFG Private Sale",
        external: false,
        env: Paths.PrivateSale.env
    },
    {
        path: "https://tofunft.com/collection/moonfit-beast-and-beauty/items",
        title: "Buy MoonBeast",
        external: true,
        env: ['local', 'development', 'production']
    },
    {
        path: "https://tofunft.com/collection/moonfit-mint-pass/items",
        title: "Buy MintPass",
        external: true,
        env: ['local', 'development', 'production']
    },
]

export const HomeActions = [
    {
        path: Paths.MintPassMinting.path,
        title: "Mint Pass",
        external: false,
        env: Paths.MintPassMinting.env
    },
    {
        path: Paths.PrivateSale.path,
        title: "MFG Private Sale",
        external: false,
        env: Paths.PrivateSale.env
    },
]
