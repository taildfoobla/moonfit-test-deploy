import React from "react"
import { Col } from "antd"
import "./styles.less"
import DescriptionProduct from "./DescriptionProduct"
import DescriptionNft from "./DescriptionNft"
import DescriptionToken from "./DescriptionToken"

const Left = (props) => {

    const { event } = props

    return (
        <Col xs={24} xl={16} className="left-content">
            {
                event?.event_type?.title === "merchandise" && <DescriptionProduct {...props} />
            }
            {
                event?.event_type?.title === "nft" && <DescriptionNft {...props} />
            }
            {
                ["raffle_game", "outside_event"].includes(event?.event_type?.title) && <DescriptionToken {...props} />
            }
        </Col>
    )
}

export default Left
