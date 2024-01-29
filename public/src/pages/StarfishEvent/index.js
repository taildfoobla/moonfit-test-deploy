import {Button, Tooltip} from "antd"
import moment from "moment"
import React, {Fragment, useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import bottle from "../../assets/images/algem/bottle.png"
import box from "../../assets/images/algem/box.png"
import egg from "../../assets/images/algem/egg.png"
import hat from "../../assets/images/algem/hat.png"
import mfr from "../../assets/images/algem/mfr.png"
import shoe from "../../assets/images/algem/shoe.png"
import eventTitle from "../../assets/images/starfish/title.png"
import eventPool from "../../assets/images/starfish/event-pool.png"
// import exclusiveBadge from "../../assets/images/hashkey/exclusive-badge.png"
import tmfg from "../../assets/images/algem/tmfg.png"
import gift from "../../assets/images/christmas/gift.png"
import check from "../../assets/images/valentine/check.png"
import times from "../../assets/images/valentine/times.png"
import MFCountdown from "../../components/Countdown"
import MFModal from "../../components/MFModal"
import StarfishWrapper from "../../components/Wrapper/StarfishWrapper"
import {useAuth} from "../../core/contexts/auth"
import EventService from "../../core/services/event"
import {LOCALSTORAGE_KEY, setLocalStorage} from "../../core/utils/helpers/storage"
import RewardModal from "./RewardModal"
import TaskModal from "./TasksModal"
import "./styles.less"

const StarfishEvent = () => {
    const params = useParams()
    const {onDisconnect, auth} = useAuth()
    const {user} = auth
    const [event, setEvent] = useState(EventService.getDefaultEventData(params.id, null))
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [reward, setReward] = useState({})
    const [timeLeft, setTimeLeft] = useState(moment(moment().endOf("day")).unix() * 1000)
    const [isExpired,setIsExPired]= useState(false)

    useEffect(() => {
        document.title = "MoonFit x Starfish Finance Challenge"
    }, [])

    useEffect(() => {
        fetchEventById()
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

    const fetchEventById = async () => {
        const {data} = await EventService.getAdventEvent(params.id)
        EventService.setDefaultEventData(params.id, data.data)
        setEvent(data.data)
        if (data.histories && data.histories.length) {
            setLocalStorage(
                LOCALSTORAGE_KEY.SPECIAL_EVENT_WINNERS,
                data && data.histories.length ? JSON.stringify(data.histories) : []
            )
            window.dispatchEvent(new Event("checkWinner"))
        }
    }

    const onCloseModal = () => {
        fetchEventById()
        setOpenModal(false)
    }

    const handleExpired = () => {
        setTimeLeft(moment(moment().endOf("day")).unix() * 1000)
    }

    return (
        <StarfishWrapper>
            <MFModal
                visible={openModal}
                centered={true}
                width={600}
                footer={false}
                className={`starfish-event ${
                    reward?.type === "token" ? "modal-reward-token-container" : "modal-reward-item-container"
                }`}
                maskClosable={false}
                onCancel={() => onCloseModal()}
            >
                <RewardModal user={user} reward={reward} toggle={() => onCloseModal()} />
            </MFModal>
            <div className="calendar-starfish-container">
                <div className="title">
                    <img src={eventTitle} alt="title" />
                    <img src={eventPool} alt="pool" />
                    <div className="event-notification text-center">
                        <h4>In order to join this event:</h4>
                        <div className="list-event-notification">
                            <div className="notify d-flex">
                                <p>
                                    <span className="index">1</span>Download MoonFit Testnet App{" "}
                                    <a
                                        href="https://onelink.to/kqzrmx"
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        style={{color: "#069BEE", textDecoration: "underline"}}
                                    >
                                        here
                                    </a>
                                </p>
                            </div>
                            <div className="notify d-flex">
                                <p>
                                    <span className="index">2</span>Connect your MetaMask wallet
                                </p>
                            </div>
                            <div className="notify d-flex">
                                <p>
                                    <Tooltip
                                        key="howToPlay"
                                        placement="top"
                                        color="#069BEE"
                                        style={{color: "#000000"}}
                                        overlayClassName="starfish-tooltip"
                                        overlayStyle={{maxWidth: "320px", width: "100%"}}
                                        title="Complete daily mandatory tasks to get daily random reward and tickets to the Master Prize Pool. The more tickets they have, the more likely they are to receive rewards from Master Prize Pool."
                                    >
                                        <Fragment>
                                            <span className="index">?</span>
                                            How to play
                                        </Fragment>
                                    </Tooltip>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="calendar">
                    <div className="calendar-border">
                        <div className="month">
                            <h3 className="text-starfish">MoonFit x Starfish Finance Challenge</h3>

                            <div className="task-countdown">
                                <span className="count-text">DAILY MISSION WILL END IN</span>
                                <MFCountdown
                                    isExpired={isExpired}
                                    className="starfish-event"
                                    date={timeLeft}
                                    completedCallback={() => handleExpired()}
                                />
                            </div>
                        </div>
                        {/* <div className="weekday">
                            {WEEKDAY.map((day, index) => (
                                <div key={`weekday_${index}`}>{day}</div>
                            ))}
                        </div> */}
                        <div className="dates">
                            {event &&
                                event.length &&
                                event.map((task, index) => {
                                    return (
                                        <div key={`single_task_${index}`}>
                                            {user && (
                                                <AuthCalendar
                                                    key={"auth"}
                                                    loading={loading}
                                                    task={task}
                                                    index={index}
                                                    openModal={openModal}
                                                    setReward={setReward}
                                                    setOpenModal={setOpenModal}
                                                    refetch={fetchEventById}
                                                />
                                            )}
                                            {!user && <UnauthCalendar key={"unauth"} task={task} index={index} />}
                                        </div>
                                    )
                                })}
                        </div>
                    </div>
                </div>
                {/* <div className="exclusive-badge">
                    <a href="https://www.hashkey.id/credential/moonfit_hashkeydid" target="_blank" rel="noreferrer">
                        <img src={exclusiveBadge} alt="" />
                    </a>
                </div> */}
            </div>
        </StarfishWrapper>
    )
}

const AuthCalendar = ({loading, task, index, refetch, openModal, setReward, setOpenModal}) => {
    const [modalChallenge, setModalChallenge] = useState({
        visible: false,
        data: null,
    })

    const [width, setWidth] = useState(window.innerWidth)

    const updateDimensions = () => {
        setWidth(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener("resize", updateDimensions)
        return () => window.removeEventListener("resize", updateDimensions)
    }, [])

    const now = moment()

    const renderTooltip = (action, status) => {
        let tooltip = ""
        if (width > 996) {
            if (status === "claimed") {
                tooltip = "You have claimed the reward successfully."
            }
            if (action !== "rest" && status === "not_eligible") {
                tooltip = "The daily mission was not completed."
            }
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

    const getTaskRewardImg = (index) => {
        let image = mfr
        switch (index) {
            case 0:
                image = mfr
                break
            case 1:
                image = tmfg
                break
            case 2:
                image = egg
                break
            case 3:
                image = shoe
                break
            case 4:
                image = bottle
                break
            case 5:
                image = hat
                break
            case 6:
                image = box
                break
            default:
                break
        }
        return image
    }

    const checkCurrentTask = getCurrentNowDate() === getDayOfMonth(task?.date) && now.year() === 2023

    const toggleModal = () => {
        setModalChallenge((prev) => ({...prev, data: null, visible: !prev.visible}))
    }

    const toggleModalWithData = (data) => setModalChallenge((prev) => ({...prev, data, visible: !prev.visible}))

    return (
        <div key={`fir_${index}`}>
            <MFModal
                visible={modalChallenge.visible}
                centered={true}
                width={470}
                footer={false}
                className={`starfish-event-tasks-modal`}
                modalWithBackground={true}
                onCancel={() => toggleModal()}
                maskClosable={false}
            >
                <TaskModal
                    refetch={refetch}
                    dateOfMonth={getDayOfMonth(task?.date)}
                    visible={modalChallenge.visible}
                    taskData={modalChallenge.data}
                    taskIndex={index}
                    setReward={setReward}
                    setOpenModal={setOpenModal}
                    toggle={() => toggleModal()}
                    setModalChallenge={setModalChallenge}
                />
            </MFModal>
            <Tooltip
                placement="top"
                overlayStyle={{minWidth: "300px", textAlign: "center"}}
                title={renderTooltip(task?.type_action, task?.status)}
            >
                <div className="date-container" onClick={() => toggleModalWithData(task)}>
                    <div className={`${checkCurrentTask ? "today" : ""}`}>
                        {
                            <div
                                className={`date ${task?.status || ""}`}
                                style={{background: `url(${task?.image_url})`, backgroundSize: "cover"}}
                            >
                                {task?.status === "eligible" ? (
                                    <div className="task-eligible">
                                        <div className="task-eligible-img">
                                            <img src={gift} alt="" />
                                        </div>
                                        <div className={`task-eligible-button${loading ? " loading-button" : ""}`}>
                                            <Button type={"primary"}>Claim</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`task-detail`}>
                                        <img src={getTaskRewardImg(index)} alt="" />
                                        <p>Day {index + 1}</p>
                                    </div>
                                )}
                            </div>
                        }
                    </div>
                    {task?.status === "claimed" && <img className="status-icon" src={check} alt="" />}
                    {task?.status === "not_eligible" && new Date().getDate() !== new Date(task?.date).getDate() && (
                        <img className="status-icon" src={times} alt="" />
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
                        {task?.name}
                    </p>
                </div>
            }
        </div>
    )
}

export default StarfishEvent
