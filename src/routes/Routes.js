import App from "../App"
import Paths from "./Paths"
import PrivateSale from "../pages/PrivateSale"
import MintPassMinting from "../pages/MintPassMinting"
import Home from "../pages/Home"

const routes = [
    {
        component: App,
        routes: [
            {
                path: Paths.Home,
                exact: true,
                component: Home
            },
            {
                path: Paths.PrivateSale,
                exact: true,
                component: PrivateSale
            },
            {
                path: Paths.MintPassMinting,
                exact: true,
                component: MintPassMinting
            }
        ]
    }
]

export default routes
