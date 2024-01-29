import React, {useEffect, useState} from "react"
import leafLeft from "../../assets/images/christmas/leaf-left.png"
import leafRight from "../../assets/images/christmas/leaf-right.png"
import ChristmasWrapper from "../../components/Wrapper/ChristmasWrapper"
import "./styles.less"
import {useParams} from "react-router-dom"
import {useAuth} from "../../core/contexts/auth"
import EventService from "../../core/services/event"
import {secondsToMinutesNumber} from "../../core/utils/helpers/clan-battle"
import gift from "../../assets/images/christmas/gift.png"
import times from "../../assets/images/christmas/times.png"
import check from "../../assets/images/christmas/check.png"
import {LoadingOutlined} from "@ant-design/icons"
import {Button, message, Spin, Tooltip} from "antd"
import RewardModal from "./RewardModal"
import MFModal from "../../components/MFModal"
import Snowfall from "react-snowfall"
import moment from "moment"
import MFCountdown from "../../components/Countdown"
import {Helmet} from "react-helmet"

const antIcon = <LoadingOutlined style={{fontSize: 24, color: "#000"}} spin />

const CalendarEvent = () => {
    const params = useParams()
    const {onDisconnect, auth} = useAuth()
    const {user} = auth
    const [eventId, setEventId] = useState(null)
    const [event, setEvent] = useState(EventService.getDefaultEventData(params.id, null))
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [reward, setReward] = useState({})
    const [timeLeft, setTimeLeft] = useState(moment(moment().endOf("day")).unix() * 1000)
    const [isExpired,setIsExPired]= useState(false)

    useEffect(() => {
        fetchEventById(params.id)
        // const eventStatus= localStorage.getItem("EVENTS_STATUS")
        // if(eventStatus){
        //     const data = eventStatus.find(event=>event.slug==params.id)
        //     const endTime = Date.parse(new Date(data.end))
        //     const todayTime = Date.now()
        //     if(todayTime>endTime){
        //         setIsExPired(true)
        //     }
        // }
    }, [params.id, user, onDisconnect])


    const fetchEventById = async (id) => {
        const {data} = await EventService.getEventById(id)
        EventService.setDefaultEventData(params.id, data.christmas_event)
        setEvent(data?.christmas_event)
        setEventId(data?.id)
    }

    const onClaim = async (date) => {
        try {
            setLoading(true)
            const req = {
                event_id: eventId,
                date,
            }
            const res = await EventService.claimChristmas(req)
            setLoading(false)
            const {error} = res.data
            if (error) {
                fetchEventById(params.id)
                return message.error({
                    content: error.message,
                    className: "message-error",
                    duration: 5,
                })
            } else {
                setReward(res.data)
                setOpenModal(true)
            }
        } catch (e) {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!openModal) {
            fetchEventById(params.id)
        }
    }, [openModal, setOpenModal])

    const handleExpired = () => {
        setTimeLeft(moment(moment().endOf("day")).unix() * 1000)
    }

    return (
        <ChristmasWrapper>
            <Helmet>
                <title>Christmas Event - MoonFit</title>
            </Helmet>
            <Snowfall radius={[0, 2]} speed={[0, 2]} wind={[0, 1]} snowflakeCount={200} style={{opacity: 0.5}} />
            <MFModal
                visible={openModal}
                centered={true}
                width={640}
                footer={false}
                className={`${
                    ["MFR", "MFG", "GLMR"].includes(reward?.type)
                        ? "modal-reward-token-container"
                        : "modal-reward-item-container"
                }`}
                onCancel={() => setOpenModal(false)}
            >
                <RewardModal user={user} reward={reward} toggle={() => setOpenModal(false)} />
            </MFModal>
            <div className="calendar-container">
                <div className="title">
                    <h2>Beat The Streak</h2>
                    <div className="sub-title">
                        <img className="left" src={leafLeft} />
                        <h1 className="text-triple-gradient-2">Advent Challenge</h1>
                        <img className="right" src={leafRight} />
                    </div>
                    <div className="event-notification text-center">
                        <h4>In order to join this event</h4>
                        <div className="list-event-notification">
                            <div className="notification d-flex">
                                <p>
                                    <span>1</span>Use MoonFit app version 0.2.0
                                </p>
                            </div>
                            <div className="notification d-flex">
                                <p>
                                    <span>2</span>Enable Incentivized Testnet Mode
                                </p>
                            </div>
                            <div className="notification d-flex">
                                <p>
                                    <span>3</span>Connect your wallet into the app
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="calendar">
                    <div className="calendar-border">
                        <div className="month">
                            <h3 className="text-primary">Christmas Challenge</h3>

                            <div className="task-countdown">
                                <h4>Daily mission will end in</h4>
                                <MFCountdown isExpired={isExpired} date={timeLeft} completedCallback={() => handleExpired()} />
                            </div>
                        </div>
                        <div className="dates">
                            {event &&
                                event?.list_task.map((task, index) => {
                                    return (
                                        <>
                                            {user && (
                                                <AuthCalendar
                                                    key={"auth"}
                                                    loading={loading}
                                                    task={task}
                                                    index={index}
                                                    onClaim={onClaim}
                                                />
                                            )}
                                            {!user && <UnauthCalendar key={"unauth"} task={task} index={index} />}
                                        </>
                                    )
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </ChristmasWrapper>
    )
}

const getTaskDetail = (typeAction = "rest", type = "", value = 0) => {
    let output = ""
    if (typeAction === "rest") {
        output = "Rest"
    } else {
        switch (type) {
            case "distance":
                output = `Run ${value ? value / 1000 : 0} km a day`
                break
            case "kcal_burned":
                output = `Burn ${value} ${value > 1 ? "calories" : "calory"} a day`
                break
            case "times":
                output = `Run ${secondsToMinutesNumber(value)} minute${
                    secondsToMinutesNumber(value) > 1 ? "s" : ""
                } a day`
                break
            default:
                break
        }
    }
    return output
}

const AuthCalendar = ({loading, task, index, onClaim}) => {
    const onClaimReward = (date) => onClaim(date)

    const renderTooltip = (action, status) => {
        let tooltip = ""
        if (status === "claimed") {
            tooltip = "You have claimed the reward successfully."
        }
        if (action !== "rest" && status === "not_eligible") {
            tooltip = "The daily mission was not completed."
        }
        return tooltip
    }

    return (
        <div key={`fir_${index}`}>
            <Tooltip placement="top" title={renderTooltip(task?.type_action, task?.status)}>
                <div className="date-container">
                    <div className={`${new Date().getDate() === new Date(task?.date).getDate() ? "today" : ""}`}>
                        {
                            <div
                                className={`date ${task?.status}`}
                                style={{background: `url(${task?.image_url})`, backgroundSize: "cover"}}
                            >
                                <span className="date-of-month">
                                    <time>{new Date(task?.date).getDate()}</time>
                                </span>
                                {task?.status === "eligible" && (
                                    <div className="task-eligible">
                                        <div className="task-eligible-img">
                                            <img src={gift} />
                                        </div>
                                        <div className={`task-eligible-button${loading ? " loading-button" : ""}`}>
                                            <Button type={"primary"} onClick={() => onClaimReward(task?.date)}>
                                                {/* {loading ? <Spin indicator={antIcon} /> : "Claim"} */}
                                                Claim
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                {task?.status !== "eligible" && (
                                    <div className={`task-detail`}>
                                        <div
                                            className={
                                                task?.type_action === "rest"
                                                    ? "rest"
                                                    : task?.type === "distance"
                                                    ? "distance"
                                                    : "run"
                                            }
                                        >
                                            <p>{getTaskDetail(task?.type_action, task?.type, task?.value)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                    </div>
                    {task?.status === "claimed" && <img className="status-icon" src={check} />}
                    {task?.type_action !== "rest" &&
                        task?.status === "not_eligible" &&
                        new Date().getDate() !== new Date(task?.date).getDate() && (
                            <img className="status-icon" src={times} />
                        )}
                </div>
            </Tooltip>
        </div>
    )
}

const UnauthCalendar = ({task, index}) => {
    return (
        <div
            key={`sec_${index}`}
            className={`${new Date().getDate() === new Date(task?.date).getDate() ? "today" : ""}`}
        >
            {
                <div className={`date`} style={{background: `url(${task?.image_url})`, backgroundSize: "cover"}}>
                    <span className="date-of-month">
                        <time>{new Date(task?.date).getDate()}</time>
                    </span>
                    <p
                        className={
                            task?.type_action === "rest" ? "rest" : task?.type === "distance" ? "distance" : "run"
                        }
                    >
                        {getTaskDetail(task?.type_action, task?.type, task?.value)}
                    </p>
                </div>
            }
        </div>
    )
}

export default CalendarEvent
