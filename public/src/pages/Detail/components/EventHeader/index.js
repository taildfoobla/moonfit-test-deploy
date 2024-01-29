import React from "react"
import "./styles.less"
import { Row, Col, Tag } from "antd"
import {
    GiftOutlined,
    CheckCircleOutlined,
    TrophyOutlined,
    FrownOutlined
} from "@ant-design/icons";
import { ReactComponent as IconEventStart } from "@svgPath/calender.svg";
import { ReactComponent as IconEventEnd } from "@svgPath/calender-x.svg";
import { ReactComponent as IconEventWeekly } from "@svgPath/calender-weekly.svg"
import FlyingSaucer from "../../../../assets/images/icons/flying-saucer.svg"
import moment from "moment"
import { pluralize } from "../../../../core/utils/helpers/utils";

const EventHeader = (props) => {

    const { event, nftBalance, userData, userEventData } = props
    const isWeeklyEvent = event?.event_time?.title === "weekly"

    return (
        <div className="event-header">
            {
                event?.banner_event && <Row className="header-banner event-status">
                    <img src={event?.banner_event?.url} alt="banner" />
                    <RenderStatusTag status={event.status} />
                </Row>
            }
            <Row className="header-tag">
                <Col span={24}>
                    <Row className="event-tag">
                        <RenderUserTag type={event?.user_type?.type} />
                    </Row>
                    <Row justify="space-between" className="header-title" align="top">
                        <h4 className="title">{event.title}</h4>
                    </Row>
                    <Row className="reward-claimed">
                        {
                            <span className="total-reward">
                                <GiftOutlined /> <span className="total-count">{event.number_slot ? `${event.count}/${event.number_slot}` : event.count}</span> {event?.event_type?.title === "raffle_game" ? "people joined" : `${pluralize(event.count, "reward")} claimed`}
                            </span>
                        }
                        {
                            userData && <RenderEligible
                                eventType={event?.event_type?.title}
                                status={event.status}
                                userType={event?.user_type?.type}
                                isSpin={event?.weekly_raffle?.is_spin}
                                nftBalance={nftBalance}
                                isClaim={userEventData?.is_claimed}
                            />
                        }
                    </Row>
                    <Row className="event-time" gutter={8}>
                        <Col xs={12} xl={6}>
                            <div className="time">
                                <Row>
                                    <Col>
                                        <div className="timeIcon start">{isWeeklyEvent ? <IconEventWeekly /> : <IconEventStart />}</div>
                                    </Col>
                                    {

                                        isWeeklyEvent && <Col className="weeklyTitle">
                                            WEEKLY
                                        </Col>
                                    }
                                    {
                                        !isWeeklyEvent && <Col>
                                            <div className="timeTitle">START</div>
                                            <div className="timeDate">{moment.utc(event.start).format("ll")}</div>
                                        </Col>
                                    }
                                </Row>
                            </div>
                        </Col>
                        <Col xs={12} xl={6}>
                            <div className="time">
                                <Row>
                                    <Col>
                                        <div className="timeIcon end"><IconEventEnd /></div>
                                    </Col>
                                    <Col>
                                        {
                                            isWeeklyEvent && <>
                                                <div className="timeTitle">FROM</div>
                                                <div className="timeDate">{moment.utc(event.start).format("ll")}</div>
                                            </>
                                        }
                                        {
                                            !isWeeklyEvent && <>
                                                <div className="timeTitle">END</div>
                                                <div className="timeDate">{moment.utc(event.end).format("ll")}</div>
                                            </>
                                        }
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Col>
                {/* <Col xs={24} md={8} xl={6}>
                    <Row className="btn-share-row" justify="center" align="top">
                        <Button type="primary"
                            href={`http://twitter.com/share?text=Let's join this event&url=${window.location.href}`}
                            target="_blank"
                            className="twitter"
                            icon={<TwitterOutlined />}>
                            SHARE ON TWITTER
                        </Button>
                    </Row>

                </Col> */}
            </Row>
        </div>
    )
}

const RenderEligible = (props) => {
    let { eventType, status, userType, nftBalance, isClaim, isSpin } = props

    userType = userType?.toLowerCase()
    if (eventType === "outside_event") return null
    if (status === "live") {
        if (nftBalance.total === 0 && eventType === "raffle_game") return <span className="unavailable-claim"><FrownOutlined />You need to HODL at least one MoonFit NFT to join this raffle</span>
        if (userType === "everyone" || userType === "whitelisted" || (userType === "holders" && nftBalance.total > 0)) {
            return eventType === "raffle_game" ? <span className="available-claim"><CheckCircleOutlined />You are eligible to join this raffle.</span> : <span className="available-claim"><CheckCircleOutlined />You are eligible to claim this reward!</span>
        }
        return <span className="unavailable-claim"><FrownOutlined />You are not eligible to claim this reward!</span>
    }
    if (status === "expired") {
        if (eventType === "merchandise") return <span className="unavailable-claim"><FrownOutlined />You are not eligible to claim this reward!</span>
        if (eventType === "raffle_game") {
            if (isSpin) {
                return isClaim ? <span className="available-claim"><TrophyOutlined />You won this raffle</span> : <span className="unavailable-claim"><FrownOutlined />You has not won this raffle</span>
            } else {
                return <span className="raffle-game-end"><img alt="" src={FlyingSaucer} />The raffle has ended. Winner will be announced soon!</span>
            }
        }
    }
}

const RenderStatusTag = (props) => {
    let color = ""
    switch (props?.status) {
        case "live":
            color = "#4CCBC9"
            break;
        case "upcoming":
            color = "#A5D990"
            break;
        case "expired":
            color = "#EF2763"
            break;
        default: break;
    }
    return color ? <Tag color={color} className={`status ${props.status}`}>{props.status}</Tag> : null
}

const RenderUserTag = (props) => {
    let tag = {}
    switch (props?.type?.toLowerCase()) {
        case "holders":
            tag = {
                color: '#F0489F',
                class: 'holders',
            }
            break;
        case "whitelisted":
            tag = {
                color: '#A16BD8',
                class: 'whitelisted',
            }
            break;
        case "everyone":
            tag = {
                color: '#EFAA5D',
                class: 'everyone',
            }
            break;
        default: break;
    }
    return tag ? <Tag color={tag.color} className={`triangle ${tag.class}`}>{props.type}</Tag> : null
}

export default EventHeader
