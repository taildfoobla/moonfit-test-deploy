import React from "react"
import { Row } from "antd"

const RewardToken = (props) => {
    const { event } = props

    return (
        <>
            <Row>
                <h3 className="raffle-game-title">REWARDS</h3>
            </Row>
            <Row className="reward-token-box">
                {/* <h3>{`${event.weekly_raffle.valuable_reward} $${event.weekly_raffle.reward_type}`}</h3> */}
                <h3>{event.weekly_raffle.reward_type}</h3>
            </Row>
        </>
    )
}

export default RewardToken