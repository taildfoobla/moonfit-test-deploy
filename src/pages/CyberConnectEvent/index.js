import React, {useEffect, useState} from "react"
import "./styles.less"
import {useParams} from "react-router-dom"
import {useAuth} from "../../core/contexts/auth"
import EventService from "../../core/services/event"
import gift from "../../assets/images/christmas/gift.png"
import times from "../../assets/images/valentine/times.png"
import check from "../../assets/images/valentine/check.png"
import eventTitle from "../../assets/images/lunar/banner.png"
import advanced from "../../assets/images/summer/advanced.svg"
import photoTask from "../../assets/images/summer/photo-task.svg"
import zealyTask from "../../assets/images/summer/zealy-task.svg"
import moonfitxCyberConnect from "../../assets/images/cyber-connect/moonfitxcyber-connect.png"
import accountAbstraction from "../../assets/images/cyber-connect/account-abstraction.png"
import {Button, message as AntdMessage, Tooltip} from "antd"
import RewardModal from "./RewardModal"
import MFModal from "../../components/MFModal"
import moment from "moment"
import MFCountdown from "../../components/Countdown"
import {LOCALSTORAGE_KEY, getLocalStorage, setLocalStorage} from "../../core/utils/helpers/storage"
import CyberConnectWrapper from "../../components/Wrapper/CyberConnectWrapper"
import TaskModal from "./TasksModal"

const CyberConnectEvent = () => {
    const params = useParams()
    const {onDisconnect, auth, handleGetAccessToken, provider} = useAuth()
    const {user} = auth
    const [event, setEvent] = useState(EventService.getDefaultEventData(params.id, null))
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [reward, setReward] = useState({})
    const [timeLeft, setTimeLeft] = useState(moment(moment().endOf("day")).unix() * 1000)
    const [backgroundList, setBackgoundList] = useState([])
    const [isExpired, setIsExPired] = useState(false)

    useEffect(() => {
        document.title = "MoonFit - Moonfit x CyberConnect"
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

    const fetchEventById = async (text = null) => {
        // const {data} = await EventService.getAdventEvent(params.id)
        // EventService.setDefaultEventData(params.id, data.data)
        const {data} = await EventService.getAdventEventV2(params.id)
        const {success, message, data: data2} = data
        if (data2) {
            EventService.setDefaultEventData(params.id, data.data)
            setEvent(data.data)
            setBackgoundList(data.background_task)
            if (data.histories && data.histories.length) {
                setLocalStorage(
                    LOCALSTORAGE_KEY.SPECIAL_EVENT_WINNERS,
                    data && data.histories.length ? JSON.stringify(data.histories) : []
                )
                window.dispatchEvent(new Event("checkWinner"))
            }
        } else {
            if (text !== null) {
                console.log("disconect")
                onDisconnect()
                return AntdMessage.error({
                    key:"err",
                    content: "Your login session has expired",
                    className: "message-error",
                    duration: 5,
                })
            } else {
                const signature = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))
                const account = signature?.account
                if (account) {
                    const userSelectedId = getLocalStorage(LOCALSTORAGE_KEY.SELECTED_USER_ID)
                    const res = await handleGetAccessToken(account, userSelectedId)
                    const newData = res?.data?.data
                    if (newData) {
                        const accessToken = newData.access_token
                        const refreshToken = newData.refresh_token
                        setLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN, accessToken)
                        setLocalStorage(LOCALSTORAGE_KEY.REFRESH_TOKEN, refreshToken)
                        fetchEventById("reCall")
                    } else {
                        console.log("disconect")
                        onDisconnect()
                        return AntdMessage.error({
                            key:"err",
                            content: "Your login session has expired",
                            className: "message-error",
                            duration: 5,
                        })
                    }
                }
            }
        }
    }
    const onCloseModal = () => {
        fetchEventById()
        setOpenModal(false)
    }

    const handleExpired = () => {
        setTimeLeft(moment(moment().endOf("day")).unix() * 1000)
    }

    const openNewTab = (url) => {
        window.open(url)
    }

    return (
        <CyberConnectWrapper>
            <MFModal
                visible={openModal}
                width={570}
                height={520.63}
                centered={true}
                footer={false}
                className={`advent-onchain ${
                    reward?.type === "token" ? "modal-reward-token-container" : "modal-reward-item-container"
                }`}
                maskClosable={false}
                onCancel={() => onCloseModal()}
            >
                <RewardModal user={user} reward={reward} toggle={() => onCloseModal()} />
            </MFModal>
            {/* <MFModal
                visible={openModal}
                width={570}
              
                centered={true}          
                footer={false}
                className={`lunar-gaming-festival-claim ${
                    reward?.type === "token" ? "modal-reward-token-container" : "modal-reward-item-container"
                }`}
                maskClosable={false}
                onCancel={() => onCloseModal()}
            >
                <ClaimModal user={user} reward={{type:'token'}} toggle={() => onCloseModal()} />
            </MFModal> */}
            <div className="calendar-advent-onchain-container">
                <div className="advent-onchain-header">
                    {/* <p className="big-text">Lunar Gaming Festival </p>
                    <p className="small-text">& Thanksgiving Challenge</p> */}
                    <img src={moonfitxCyberConnect} />
                    <img src={accountAbstraction} />
                </div>
                <div className="title">
                    {/* <img src={eventTitle} alt="title" /> */}
                    <div className="event-notification text-center">
                        <h4>How to join this event:</h4>
                        {/* <div className="event-guide"></div> */}
                        <div className="list-event-notification">
                        <div className="notify d-flex">
                                <p>
                                    {/* <span className="index">1</span> */}
                                    Complete tasks to earn random rewards from MoonFit: $GLMR, $ASTR, $tMFG, $MFR, Exclusive Merchandise ...
                                </p>
                            </div>
                            {/* <div className="notify d-flex">
                                <p>
                                    <span className="index">1</span>Connect your wallet
                                </p>
                            </div>
                            <div className="notify d-flex">
                                <p>
                                    <span className="index">2</span>Download MoonFit App{" "}
                                    <span
                                        style={{color: "#E4007B", cursor: "pointer"}}
                                        onClick={() => {
                                            openNewTab("https://onelink.to/kqzrmx")
                                        }}
                                    >
                                        here
                                    </span>
                                </p>
                            </div>
                            <div className="notify d-flex">
                                <Tooltip
                                    overlayClassName="how-to-play"
                                    color="#01FFA0"
                                    placement="topLeft"
                                    title="Complete tasks to earn random rewards from MoonFit: $GLMR, $ASTR, $tMFG, $MFR, Exclusive Merchandise"
                                >
                                    {" "}
                                    <p>
                                        <span className="index guide">?</span>
                                        How to play
                                    </p>{" "}
                                </Tooltip>
                            </div> */}
                        </div>
                    </div>
                </div>
                <div className="calendar">
                    <div className="calendar-border">
                        <div className="month">
                            <h3 className="text-summer">Moonfit x cyberconnect</h3>

                            {/* <div className="task-countdown">
                                <span className="count-text">DAILY MISSION WILL END IN</span>
                                <MFCountdown
                                    isExpired={isExpired}
                                    className="summer-event"
                                    date={timeLeft}
                                    completedCallback={() => handleExpired()}
                                />
                            </div> */}
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
                                                    backgroundData={backgroundList}
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
        </CyberConnectWrapper>
    )
}

const AuthCalendar = ({loading, task, index, refetch, openModal, setReward, setOpenModal, backgroundData}) => {
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
                width={470}
                footer={false}
                className={`advent-onchain-modal`}
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
                    backgroundData={backgroundData}
                />
            </MFModal>
            <Tooltip
                placement="top"
                overlayClassName="cyber-tooltip"
                overlayStyle={{minWidth: "300px", textAlign: "center"}}
                title={renderTooltip(task?.type_action, task?.status)}
            >
                <div className="date-container" onClick={() => toggleModalWithData(task)}>
                    <div className={`${checkCurrentValentine ? "today" : ""}`}>
                        {
                            <div
                                className={`date ${(task?.status !== "not_eligible" && task?.status) || ""}`}
                                // className="date"
                                style={{
                                    background: `url(${task?.image_url})`,
                                    // backgroundSize: "cover"
                                }}
                            >
                                {/* <span className="date-of-month">
                                    <time>{getDayOfMonth(task?.date)}</time>
                                </span> */}
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
                                            {/* <p>{task?.name}</p> */}
                                        </div>
                                    </div>
                                )}
                                {/* <div className="task-icon">{renderTaskType(task?.tasks, task?.date)}</div> */}
                            </div>
                        }
                    </div>
                    {task?.status === "claimed" && <img className="status-icon" src={check} alt="" />}
                    {/* {task?.status === "not_eligible" && new Date().getDate() !== new Date(task?.date).getDate() && (
                        <img className="status-icon" src={times} alt="" />
                    )} */}
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
                <div
                    className={`date`}
                    style={{
                        background: `url(${task?.image_url})`,
                        // backgroundSize: "cover"
                    }}
                >
                    {/* <span className="date-of-month">
                        <time>{new Date(task?.date).getDate()}</time>
                    </span> */}
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

export default CyberConnectEvent

