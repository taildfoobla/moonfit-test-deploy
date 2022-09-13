import App from "../App"
import Paths from "./Paths"
import MFGPrivateSale from "../pages/MFGPrivateSale"
import MintPassMinting from "../pages/MintPassMinting"
import NFTSaleRoundOne from "../pages/NFTSaleRoundOne"
import Home from "../pages/Home"

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
                path: Paths.NFTSaleR1.path,
                exact: true,
                component: NFTSaleRoundOne
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
            }
        ]
    }
]

export default routes
