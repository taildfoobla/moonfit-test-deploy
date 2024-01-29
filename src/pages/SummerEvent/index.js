import React, {useEffect, useState} from "react"
import "./styles.less"
import {useParams} from "react-router-dom"
import {useAuth} from "../../core/contexts/auth"
import EventService from "../../core/services/event"
import gift from "../../assets/images/christmas/gift.png"
import times from "../../assets/images/valentine/times.png"
import check from "../../assets/images/valentine/check.png"
import eventTitle from "../../assets/images/summer/title.png"
import advanced from "../../assets/images/summer/advanced.svg"
import photoTask from "../../assets/images/summer/photo-task.svg"
import zealyTask from "../../assets/images/summer/zealy-task.svg"
import {Button, message, Tooltip} from "antd"
import RewardModal from "./RewardModal"
import MFModal from "../../components/MFModal"
import moment from "moment"
import MFCountdown from "../../components/Countdown"
import {LOCALSTORAGE_KEY, setLocalStorage} from "../../core/utils/helpers/storage"
import SummerWrapper from "../../components/Wrapper/SummerWrapper"
import TaskModal from "./TasksModal"

const SummerEvent = () => {
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
        document.title = "MoonFit - Summer Fitsnap Event"
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

    console.log("event",event)

    return (
        <SummerWrapper>
            <MFModal
                visible={openModal}
                centered={true}
                width={600}
                footer={false}
                className={`summer-fitsnap-event ${
                    reward?.type === "token" ? "modal-reward-token-container" : "modal-reward-item-container"
                }`}
                maskClosable={false}
                onCancel={() => onCloseModal()}
            >
                <RewardModal user={user} reward={reward} toggle={() => onCloseModal()} />
            </MFModal>
            <div className="calendar-summer-container">
                <div className="title">
                    <img src={eventTitle} alt="title" />
                    <div className="event-notification text-center">
                        <h4>In order to join this event:</h4>
                        <div className="list-event-notification">
                            <div className="notify d-flex">
                                <p>
                                    <span className="index">1</span>Users complete daily challenge
                                </p>
                            </div>
                            <div className="notify d-flex">
                                <p>
                                    <span className="index">2</span>Post your photos on Twitter + tag @MoonFitOfficial{" "}
                                    <span style={{color: "#E4007B"}}>#FitSnap</span>
                                </p>
                            </div>
                            <div className="notify d-flex">
                                <p>
                                    <span className="index">3</span>Copy your Twitter link & paste on the “Tweets”
                                    Discord Channel
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="calendar">
                    <div className="calendar-border">
                        <div className="month">
                            <h3 className="text-summer">summer fitsnap Challenge </h3>

                            <div className="task-countdown">
                                <span className="count-text">DAILY MISSION WILL END IN</span>
                                <MFCountdown
                                    isExpired={isExpired}
                                    className="summer-event"
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
            </div>
        </SummerWrapper>
    )
}

const AuthCalendar = ({loading, task, index, refetch, openModal, setReward, setOpenModal}) => {
    const [modalChallenge, setModalChallenge] = useState({
        visible: false,
        data: null,
    })
    const now = moment()

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

    const renderTaskType = (tasks = [], date) => {
        const isAdvancedTask = tasks.some(
            (item) => item.type_action === "run_a_session" && item.type_reward === "advanced"
        )
        const isZealyTask = tasks.some((item) => item.type_action === "zealy_task")
        let taskType = null
        if (date === "2023-06-09") {
            taskType = (
                <div>
                    <img src={advanced} alt="" />
                    <img src={zealyTask} alt="" style={{position: "absolute", left: "20px"}} />
                </div>
            )
        } else if (date === "2023-06-13") {
            taskType = <img src={photoTask} alt="" />
        } else {
            if (isAdvancedTask) {
                taskType = <img src={advanced} alt="" />
            }
            if (isZealyTask) {
                taskType = <img src={zealyTask} alt="" />
            }
        }

        return taskType
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

    const toggleModal = () => {
        setModalChallenge((prev) => ({...prev, data: null, visible: !prev.visible}))
    }

    const toggleModalWithData = (data) => setModalChallenge((prev) => ({...prev, data, visible: !prev.visible}))

    return (
        <div key={`fir_${index}`}>
            <MFModal
                visible={modalChallenge.visible}
                centered={true}
                width={500}
                footer={false}
                className={`summer-event-tasks-modal`}
                modalWithBackground={true}
                onCancel={() => toggleModal()}
                maskClosable={false}
            >
                <TaskModal
                    refetch={refetch}
                    dateOfMonth={getDayOfMonth(task?.date)}
                    visible={modalChallenge.visible}
                    taskData={modalChallenge.data}
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
                    <div className={`${checkCurrentValentine ? "today" : ""}`}>
                        {
                            <div
                                className={`date ${task?.status || ""}`}
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
                                            <Button type={"primary"}>
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
                                            <p>{task?.name}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="task-icon">{renderTaskType(task?.tasks, task?.date)}</div>
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

export default SummerEvent
