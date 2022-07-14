import Paths from "./Paths"

export const AppRoutes = [
    {
        path: Paths.Home.path,
        title: "Home",
        external: false,
        env: Paths.Home.env
    },
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
    {
        path: "https://whitepaper.moonfit.xyz/",
        title: "Whitepaper",
        external: true,
        env: ['development', 'production']
    },
    {
        path: "https://litepaper.moonfit.xyz",
        title: "Litepaper",
        external: true,
        env: ['development', 'production']
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