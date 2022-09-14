import App from "../App"
import Paths from "./Paths"
import MFGPrivateSale from "../pages/MFGPrivateSale"
import MintPassMinting from "../pages/MintPassMinting"
// import NFTSale from "../pages/NFTSaleRoundOne"
import NFTSale from "../pages/NFTSaleRoundTwo"
import Home from "../pages/Home"
import NotFound from "../pages/NotFound"

const routes = [
    {
        component: App,
        routes: [
            {
                path: Paths.Home.path,
                exact: true,
                component: Home
            },
            {
                path: Paths.NFTSale.path,
                exact: true,
                component: NFTSale
            },
            {
                path: Paths.PrivateSale.path,
                exact: true,
                component: MFGPrivateSale
            },
            {
                path: Paths.MintPassMinting.path,
                exact: true,
                component: MintPassMinting
            },
            {
                path: '*',
                exact: true,
                component: NotFound
            },
        ]
    }
]

export default routes
