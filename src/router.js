import React from "react"
import { Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import ClanBattle from "./pages/ClanBattle"
import EventDetail from "./pages/Detail"
import Home from "./pages/Home"
import SpecialEvent from "./pages/SpecialEvent"
import Deposit from "./pages/Deposit"
import Mint from "./pages/Mint"
import LuckyWheel from "./pages/LuckyWheel"
import Explore from "./pages/Explore"
import AstarRewards from "./pages/AstarRewards"
import AssetsManagement from "./pages/AssetsManagement"
import Withdraw from "./pages/Withdraw"
import TwoFaPage from "./pages/TwoFA"
import BountySpin from "./pages/BountySpin"
import HomeTest from "./core/contexts/Home"

const router = (
    <Routes>
        <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore/>}/>
            <Route path="/special-event/lucky-wheel" element={<LuckyWheel/>}/>
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/mint" element={<Mint />} />
            <Route path="/events/:id" element={<EventDetail />} />
            {/* <Route path="/clan-battle/:id" element={<ClanBattle />} /> */}
            <Route path="/special-event/:id" element={<SpecialEvent />} />
            <Route path="/astar-rewards" element={<AstarRewards/>}/>
            <Route path="/manage-assets" element={<AssetsManagement/>}/>
            <Route path="/withdraw" element={<Withdraw/>}/>
            <Route path="/two-fa" element={<TwoFaPage/>}/>
            <Route path="/special-event/bounty-spin" element={<BountySpin/>}/>
            <Route path="/test" element={<HomeTest/>}/>
            <Route path="*" element={<Home />} />
        </Route>

    </Routes>
)

export default router
