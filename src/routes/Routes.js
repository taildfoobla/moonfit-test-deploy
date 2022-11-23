import App from "../App"
import Paths from "./Paths"
import MFGPrivateSale from "../pages/MFGPrivateSale"
import MintPassMinting from "../pages/MintPassMinting"
// import MintPassVerify from "../pages/MintPassVerify"
// import NFTSale from "../pages/NFTSaleCurrentRound"
import NFTSaleStages from "../pages/NFTSaleStages"
// import NFTSaleRoundThree from "../pages/NFTSaleRoundThree"
// import NFTSaleRoundFour from "../pages/NFTSaleRoundFour"
import NFTSaleRoundWorldCup from "../pages/NFTSaleRoundWorldCup"
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
            // {
            //     path: Paths.NFTSaleRoundThree.path,
            //     exact: true,
            //     component: NFTSaleRoundThree
            // },
            // {
            //     path: Paths.NFTPublicSale.path,
            //     exact: true,
            //     component: NFTSaleRoundFour
            // },
            {
                path: Paths.NFTSaleRoundWorldCup.path,
                exact: true,
                component: NFTSaleRoundWorldCup
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
            // {
            //     path: Paths.MintPassVerify.path,
            //     exact: true,
            //     component: MintPassVerify
            // },
            {
                path: Paths.NftSaleStages.path,
                exact: true,
                component: NFTSaleStages
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
