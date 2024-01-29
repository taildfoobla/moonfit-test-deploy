import React, { useEffect, useState } from "react"
import "./styles.less"
import Banner from "../../components/Banner"
import EventsList from "./components/EventsList"
// import TweetsList from "./components/TweetsList"
import Assets from "./components/Assets"
import {useAuth} from "../../core/contexts/auth"
import {useTokeBalance} from "../../core/contexts/token-balance"

let _events = []
let _highlightEvents=[]

let storage = localStorage.getItem('_events')
if (storage) {
    try {
        storage = JSON.parse(storage)
        if (Array.isArray(storage) && storage.length > 0 && storage[0].id && storage[0].title) {
            _events = storage.slice(0,9).filter(event=>event.event_type.title!=="lucky-wheel")
            _highlightEvents=storage.filter(event=>event.is_highlight)
        }
    } catch (e) {

    }
}

const Home = () => {
    const {auth} = useAuth()
    const [highlightEvent,setHighlightEvent]=useState(_highlightEvents)
    const balance = useTokeBalance()
    const hasAssets = auth?.user?.nftBalance?.total > 0 || Object.values(balance).some((item) => Number(item) > 0)

    useEffect(() => {
        document.title = "MoonFit"
    }, [])
    return (
        <div className="home-page">
            <Banner isLoggedIn={auth?.isConnected} hasAssets={hasAssets} highlightEvent={highlightEvent} />
            {/* {auth.isConnected && <Assets />} */}
            <EventsList _events={_events} auth={auth} setHighlightEvent={setHighlightEvent} />
            {/*<TweetsList />*/}
        </div>
    )
}

export default Home
