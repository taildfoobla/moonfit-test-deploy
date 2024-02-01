import React from "react"
import {useNavigate, useParams} from "react-router-dom"
import CalendarEvent from "../CalendarEvent"
import ValentineEvent from "../ValentineEvent"
import SummerEvent from "../SummerEvent"
import AlgemEvent from "../AlgemEvent"
import HashkeyEvent from "../HashkeyEvent"
import StarfishEvent from "../StarfishEvent"
import AstridEvent from "../AstridDAOEvent"
import YuliverseEvent from "../YuliverseEvent"
import LunarEvent from "../LunarEvent"
import CyberConnectEvent from "../CyberConnectEvent"
import ChristmasEvent from "../ChristmasChallenge"
import BountySpin from "../BountySpin"
import ValentineChallenge from "../ValentineChallenge"

const SpecialEvent = () => {
    const params = useParams()
    const navigate = useNavigate()

    if (
        ![  "valentine-challenge-2024",
            "bounty-spin",
            "moonfit-x-cyberconnect-challenge",
            "christmas-challenge",
            "christmas-event",
            "valentine-event",
            "summer-fitsnap-challenge",
            "lunar-gaming-festival-thanksgiving-challenge",
            "moonfit-x-algem-challenge",
            "moonfit-x-hashkey-did-challenge",
            "moonfit-x-starfish-finance-challenge",
            "moonfit-x-astriddao-challenge",
        ].includes(params.id)
    ) {
        navigate("/")
    }

    const renderPage = () => {
        let output = null
        switch (params.id) {
            case "christmas-event":
                output = <CalendarEvent />
                break
            case "valentine-event":
                output = <ValentineEvent />
                break
            case "summer-fitsnap-challenge":
                output = <SummerEvent />
                break
            case "moonfit-x-algem-challenge":
                output = <AlgemEvent />
                break
            case "moonfit-x-hashkey-did-challenge":
                output = <HashkeyEvent />
                break
            case "moonfit-x-starfish-finance-challenge":
                output = <StarfishEvent />
                break
            case "moonfit-x-astriddao-challenge":
                output = <AstridEvent />
                break
            case "moonfit-x-yuliverse-challenge":
                output = <YuliverseEvent />
                break
            case "lunar-gaming-festival-thanksgiving-challenge":
                output = <LunarEvent />
                break
            case "christmas-challenge":
                output = <ChristmasEvent />
                break
            case "moonfit-x-cyberconnect-challenge":
                output = <CyberConnectEvent />
                break
            case "bounty-spin":
                output = <BountySpin />
                break
            case "valentine-challenge-2024":
                output= <ValentineChallenge/>
            default:
                break
        }
        return output
    }

    return <>{renderPage()}</>
}

export default SpecialEvent

