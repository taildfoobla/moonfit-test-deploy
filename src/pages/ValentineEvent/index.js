import React, {useEffect, useState} from "react"
import "./styles.less"
import {useParams} from "react-router-dom"
import {useAuth} from "../../core/contexts/auth"
import EventService from "../../core/services/event"
import {secondsToMinutesNumber} from "../../core/utils/helpers/clan-battle"
import gift from "../../assets/images/christmas/gift.png"
import times from "../../assets/images/valentine/times.png"
import check from "../../assets/images/valentine/check.png"
import {Button, message, Tooltip} from "antd"
import RewardModal from "./RewardModal"
import MFModal from "../../components/MFModal"
import moment from "moment"
import MFCountdown from "../../components/Countdown"
import ValentineWrapper from "../../components/Wrapper/ValentineWrapper"
import {LOCALSTORAGE_KEY, setLocalStorage,getLocalStorage} from "../../core/utils/helpers/storage"

const WEEKDAY = ["Monday", "tuesday", "Wednesday", "Thursday", "friday", "Saturday", "sunday"]

const ValentineEvent = () => {
    const params = useParams()
    const {onDisconnect, auth} = useAuth()
    const {user} = auth
    const [eventId, setEventId] = useState(null)
    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [reward, setReward] = useState({})
    const [timeLeft, setTimeLeft] = useState(moment(moment().endOf("day")).unix() * 1000)
    const [isExpired,setIsExPired]= useState(false)

    useEffect(() => {
        document.title = "MoonFit - Valentine Event "
    }, [])

    useEffect(() => {
        fetchEventById(params.id)
        const events = JSON.parse(getLocalStorage("_events"))
        const thisEvent = events.find((event) => {
            return event.slug === params.id
        })
        if (thisEvent && thisEvent.status === "expired") {
            setIsExPired(true)
        } else {
            setIsExPired(false)
        }
    }, [params.id, user, onDisconnect])

    const fetchEventById = async (id) => {
        const {data} = await EventService.getEventById(id)
        setEvent(data?.christmas_event)
        setLocalStorage(LOCALSTORAGE_KEY.SPECIAL_EVENT_WINNERS, JSON.stringify(data.history))
        setEventId(data?.id)
        window.dispatchEvent(new Event("checkWinner"))
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

    const onCloseModal = () => {
        fetchEventById(params.id)
        setOpenModal(false)
    }

    const handleExpired = () => {
        setTimeLeft(moment(moment().endOf("day")).unix() * 1000)
    }

    return (
        <ValentineWrapper>
            <MFModal
                visible={openModal}
                centered={true}
                width={600}
                footer={false}
                className={`valentine-event ${
                    ["MFR", "MFG", "GLMR"].includes(reward?.type)
                        ? "modal-reward-token-container"
                        : "modal-reward-item-container"
                }`}
                onCancel={() => onCloseModal()}
            >
                <RewardModal user={user} reward={reward} toggle={() => onCloseModal()} />
            </MFModal>
            <div className="calendar-valentine-container">
                <div className="title">
                    <h2>Valentine Challenge</h2>
                    <div className="sub-title">
                        <h1 className="title">Win Beauty Heart Race</h1>
                    </div>
                    <div className="event-notification text-center">
                        <h4>In order to join this event:</h4>
                        <div className="list-event-notification">
                            <div className="notification d-flex">
                                <p>
                                    <span>1</span>Use the latest version of the MoonFit app
                                </p>
                            </div>
                            <div className="notification d-flex">
                                <p>
                                    <span>2</span>Enable Incentivized Testnet Mode in the app
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
                            <h3 className="text-valentine">Valentine Challenge</h3>

                            <div className="task-countdown">
                                <span className="count-text">DAILY MISSION WILL END IN</span>
                                <MFCountdown
                                    isExpired={isExpired}
                                    className="valentine-event"
                                    date={timeLeft}
                                    completedCallback={() => handleExpired()}
                                />
                            </div>
                        </div>
                        <div className="weekday">
                            {WEEKDAY.map((day, index) => (
                                <div key={`weekday_${index}`}>{day}</div>
                            ))}
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
        </ValentineWrapper>
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
    const now = moment()
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

    const getDayOfMonth = (date) => {
        if (!date) return ""
        return date.substring(date.length - 2, date.length)
    }

    const getCurrentNowDate = () => {
        const nowDate = now.date()
        return nowDate < 10 ? `0${nowDate}` : nowDate + ""
    }

    const checkCurrentValentine =
        getCurrentNowDate() === getDayOfMonth(task?.date) && now.month() === 1 && now.year() === 2023

    return (
        <div key={`fir_${index}`}>
            <Tooltip placement="top" title={renderTooltip(task?.type_action, task?.status)}>
                <div className="date-container">
                    <div className={`${checkCurrentValentine ? "today" : ""}`}>
                        {
                            <div
                                className={`date ${task?.status}`}
                                style={{background: `url(${task?.image_url})`, backgroundSize: "cover"}}
                            >
                                <span className="date-of-month">
                                    <time>{getDayOfMonth(task?.date)}</time>
                                </span>
                                {task?.status === "eligible" && (
                                    <div className="task-eligible">
                                        <div className="task-eligible-img">
                                            <img src={gift} alt="" />
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

export default ValentineEvent
