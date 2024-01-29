import React from "react"
import { Row, Col } from "antd"
import logo from "../../../../assets/images/clan-battle/logo.png"
// import logo from "../../../../assets/images/clan-battle/wc-logo.png"
import vs from "../../../../assets/images/clan-battle/vs.png"
import level from "../../../../assets/images/clan-battle/level.png"
import timeSpent from "../../../../assets/images/clan-battle/time-spent.png"
import "./styles.less"
import moment from "moment"
import { secondsToHours } from "../../../../core/utils/helpers/clan-battle"

const BattleListTeam = (props) => {

    const { battle, listTeam, mappingClans } = props

    return (

        <div className="battle-team">
            <Row className="clan-battle-logo" justify="center">
                <img src={logo} style={{paddingBottom: "40px"}} alt="logo" />
            </Row>
            <Row className="clan-battle-title text-center" justify="center">
                <h1>{battle?.battle.name}</h1>
            </Row>
            <Row className="clan-battle-status" justify="center">
                <h3 className="text-red-glow">LIVE</h3>
            </Row>
            <Row className="clan-battle-team" justify="center">
                <Col span={10} className="battle-team-image left">
                    <Row justify="end" className="left-team">
                        <img src={listTeam[1]?.Clan.avatar} className="left-team-image" alt="team1" />
                        {/* <img src={mappingClans[Object.keys(mappingClans)[0]]?.background} className="left-team-image" alt="team1" /> */}
                        <TeamStatistic className={"left-statistic"} statistic={listTeam[1]} battle={battle} />
                    </Row>
                </Col>
                <Col span={4} className="battle-vs-image">
                    <img src={vs} alt="vs" />
                </Col>
                <Col span={10} className="battle-team-image right">
                    <Row className="right-team">
                        <img src={listTeam[0]?.Clan.avatar} className="right-team-image" alt="team2" />
                        {/* <img src={mappingClans[Object.keys(mappingClans)[1]]?.background} className="right-team-image" alt="team2" /> */}
                        <TeamStatistic className={"right-statistic"} statistic={listTeam[0]} battle={battle} />
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

const TeamStatistic = (props) => {

    const { className, statistic, battle } = props

    const dateDiff = () => {
        if (statistic.start_time) {
            const start = moment(statistic.start_time)
            const end = moment(statistic.end_time)
            const now = moment()
            const hours = moment.duration(now.diff(start)).asHours()
            if (hours < battle.battle.time) {
                return start ? secondsToHours(moment(now.diff(start) / 1000)) : "00:00:00"
            }
            return secondsToHours(moment(end.diff(start) / 1000))
        }
        return "00:00:00"
    }

    return (
        <div className={className}>
            <div className="statistic">
                <div className="total-level">
                    <div className="total-level-icon">
                        <img src={level} />
                    </div>
                    <div className="total-level-statistic">
                        <span className="">TOTAL LEVEL</span> <br />
                        <h4 className="text-primary">{statistic?.total_level}</h4>
                    </div>
                </div>
                <div className="time-spent">
                    <div className="time-spent-icon">
                        <img src={timeSpent} />
                    </div>

                    <div className="total-level-statistic">
                        <span>TIME SPENT</span> <br />
                        <h4 className="text-secondary">{dateDiff()}</h4>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default BattleListTeam