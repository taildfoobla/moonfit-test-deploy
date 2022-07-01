import App from "../App"
import Paths from "./Paths"
import PrivateSale from "../components/PrivateSale"
import MintPassMinting from "../components/MintPassMinting"

const routes = [
    {
        component: App,
        routes: [
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
