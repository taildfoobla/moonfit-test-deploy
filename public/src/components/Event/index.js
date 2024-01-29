import React from "react"
import "./styles.less"
import {Col, Image, Row, message} from "antd"
import {ReactComponent as IconEventStart} from "@svgPath/calender.svg"
import {ReactComponent as IconEventEnd} from "@svgPath/calender-x.svg"
import {ReactComponent as IconEventWeekly} from "@svgPath/calender-weekly.svg"
import {Link, useNavigate} from "react-router-dom"
import {pluralize} from "../../core/utils/helpers/utils"
import moment from "moment"
import { useAuth } from "../../core/contexts/auth"
import { auth } from "../../core/utils/helpers/firebase"

const EventItem = ({event, isHolder}) => {

    
    const {title, short_description, banner_event, count, event_type, event_time, start, end, id, status, user_type} =
        event
    const isWeeklyEvent = event_time?.title === "weekly"
    
    return (
        <div className="event" data-aos="slide-up" data-aos-delay={0}>
            <div className="event__images">
                <Image src={banner_event?.url} preview={false} className="event__image" alt="event" width={"100%"} height={185} />
                <div className={`event__status ${status}`}>{status}</div>
                {isHolder && user_type?.type?.toLowerCase() === "holders" && (
                    <div className="event__eligible">Eligible</div>
                )}
            </div>
            <div className="event__content">
                <h4 className="event__title">{title}</h4>
                <div className="event__description">{short_description}</div>
                <Row gutter={8}>
                    <Col className="event__eventTime" span={12}>
                        <div className="event__time">
                            <Row align="middle">
                                <Col>
                                    <div className="event__timeIcon -start">
                                        {isWeeklyEvent ? <IconEventWeekly /> : <IconEventStart />}
                                    </div>
                                </Col>
                                <Col>
                                    <div className={`event__timeTitle${isWeeklyEvent ? " -weeklyTitle" : ""}`}>
                                        {isWeeklyEvent ? "Weekly" : "Start"}
                                    </div>
                                    {!isWeeklyEvent && (
                                        <div className="event__timeDate">{moment.utc(start).format("ll")}</div>
                                    )}
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col className="event__eventTime" span={12}>
                        <div className="event__time -end">
                            <Row align="middle">
                                <Col>
                                    <div className="event__timeIcon -end">
                                        <IconEventEnd />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="event__timeTitle">{isWeeklyEvent ? "From" : "End"}</div>
                                    <div className="event__timeDate">
                                        {isWeeklyEvent ? moment.utc(start).format("ll") : moment.utc(end).format("ll")}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="event__bottom">
                <Row gutter={16}>
                    <Col>
                        <div
                            className={`event__ribbon${
                                user_type?.type ? " -" + String(user_type.type).toLowerCase() : ""
                            }`}
                        >
                            {user_type?.type}
                        </div>
                    </Col>
                    <Col flex="auto">
                        {count > 0 ? (
                            <div className="event__count">
                                <span className="event__countTotal">{count}</span>
                                <span className="event__countText">
                                    {["raffle_game", "christmas_event"].includes(event_type?.title) ||
                                    event_type?.title === "summer-fitsnap-challenge" ||
                                    event_type?.title === "moonfit-x-astriddao-challenge" ||
                                    event_type?.title === "moonfit-x-yuliverse-challenge"
                                        ? "people joined"
                                        : `${pluralize(count, "reward")} claimed`}
                                </span>
                            </div>
                        ) : null}
                    </Col>
                </Row>
            </div>
        </div>
    )
}

const Event = ({event, isHolder}) => {
    const {auth,isLoginSocial}=useAuth()

    const comingSoon = () =>
        message.error({
            content: "Coming soon",
            className: "message-error",
            duration: 5,
        })

    if (event?.status === "upcoming") {
        return (
            <a onClick={comingSoon}>
                <EventItem event={event} isHolder={isHolder} />
            </a>
        )
    }

    const isSpecial =
        event?.christmas_event ||
        [   "bounty-spin",
            "christmas-challenge",
            "lucky-wheel",
            "moonfit-x-cyberconnect-challenge",
            "lunar-gaming-festival-thanksgiving-challenge",
            "summer-fitsnap-challenge",
            "moonfit-x-algem-challenge",
            "moonfit-x-hashkey-did-challenge",
            "moonfit-x-starfish-finance-challenge",
            "moonfit-x-astriddao-challenge",
            "moonfit-x-yuliverse-challenge",
        ].includes(event?.event_type.title)

    const handlePreventPassThrough=(e,slug)=>{
        if(slug==="bounty-spin"){
            e.preventDefault()
            if(!auth.isConnected){
                message.error({
                    key:'err',
                    content: "Please connect wallet",
                    className: "message-error",
                    duration: 5,
                })
            }
            if(!isLoginSocial){
                message.error({ 
                    key:"err",
                    content: "Please login social",
                    className: "message-error",
                    duration: 5,
                })
            }
          
        }
    }

    return (
        <>
            {event.slug .includes("cyber-connect") ? (
                <Link to={`/${isSpecial ? "special-event" : "events"}/moonfit-x-cyberconnect-challenge`}>
                    <EventItem event={event} isHolder={isHolder} />
                </Link>
            ) : (
                <Link to={`/${isSpecial ? "special-event" : "events"}/${event?.slug}`} onClick={(e)=>{
                    handlePreventPassThrough(e,event?.slug)
                }} >
                    {" "}
                    <EventItem event={event} isHolder={isHolder} />
                </Link>
            )}
        </>
    )
}

export default Event

