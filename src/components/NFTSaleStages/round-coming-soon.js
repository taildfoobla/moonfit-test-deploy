import React from "react"
import { Tag } from "antd"
import arrowFatRight from "../../assets/images/icons/ArrowFatRight.svg"

const RoundComingSoon = ({stage}) => {

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
        <div className={`stage${stage.isSoldOut && !stage.activeSoldOut ? " sold-out" : ""}`} key={stage._id}>
            {
                stage.isSoldOut && <Tag className="badge" color="#541C8D">SOLD OUT</Tag>
            }
            <div className="stage-content">
                {dateTitle(stage.dateMsg)}
                <h4 className="mt-5 mb-3">{stage.title}</h4>
                <div className="flex mb-2">
                    <img className="arrow-right" src={arrowFatRight} alt="" /> QUANTITY: <span className="text-white ml-1"> ? NFTs</span>
                </div>
                <div className="flex mb-3">
                    <img className="arrow-right" src={arrowFatRight} alt="" /> PRICE: ?
                </div>
                <span className="description">{stage.description}</span>
            </div>
        </div>
    )
}

export default RoundComingSoon
