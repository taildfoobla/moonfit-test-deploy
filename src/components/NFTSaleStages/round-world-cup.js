import React, { useEffect, useState } from "react"
import { Tag } from "antd"
import arrowFatRight from "../../assets/images/icons/ArrowFatRight.svg"
import moonBeam from "../../assets/images/icons/moonbeam.svg"

import { NFT_SALE_ROUNDS_INFO } from '../../constants/blockchain'

const currentRoundSale = NFT_SALE_ROUNDS_INFO.WC

const RoundWorldCup = () => {
    const [isSoldOut, setIsSoldOut] = useState(true)
    const [maxAmountRound, setMaxAmountRound] = useState(currentRoundSale.amount)


    useEffect(() => {
        init().then()
    }, [])

    const init = async () => {
        setMaxAmountRound(currentRoundSale.amount)
        setIsSoldOut(true)
    }

    const dateTitle = (dateMsg) => {
        const day = dateMsg.substring(0, 2)
        const ordinalNumber = dateMsg.substring(2, 4)
        const month = dateMsg.substring(5, dateMsg.length)

        return (
            <>
                <div className="flex">
                    <h1>{day}</h1>
                    <h3 className="pt-2">{ordinalNumber}</h3>
                </div>
                <h3>{month}</h3>
            </>
        )
    }

    return (
        <div className={`stage${isSoldOut && !currentRoundSale.activeSoldOut ? " sold-out" : ""}`}>
            {
                isSoldOut && <Tag className="badge" color="#541C8D">SOLD OUT</Tag>
            }
            <div className="stage-content">
                {dateTitle(currentRoundSale.dateMsg)}
                <h4 className="mt-5 mb-3">{currentRoundSale.title}</h4>
                <div className="flex mb-2">
                    <img className="arrow-right" src={arrowFatRight} alt="" /> QUANTITY: <span className="text-white ml-1"> {maxAmountRound} NFTs</span>
                </div>
                <div className="flex mb-3">
                    <img className="arrow-right" src={arrowFatRight} alt="" /> PRICE:
                    <img className="ic-moonbeam" src={moonBeam} alt="" /> <span className="text-[#4ccbc9] mr-1">{currentRoundSale.price}
                                    </span>
                </div>
                <span className="description">{currentRoundSale.description}</span>
            </div>
        </div>
    )
}

export default RoundWorldCup
