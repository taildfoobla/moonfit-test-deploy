import React from "react"
import "./styles.less"
import advanced from "../../../assets/images/summer/advanced.svg"
import photoTask from "../../../assets/images/summer/photo-task.svg"
import zealyTask from "../../../assets/images/summer/zealy-task.svg"
import dailyTask from "../../../assets/images/summer/daily-task.svg"
import checkCircle from "../../../assets/images/summer/check-circle.svg"
import {useEffect} from "react"
import EventService from "../../../core/services/event"
import {Button, message as AntdMessage, Spin} from "antd"
import {useState} from "react"
import {Fragment} from "react"
import {LoadingOutlined} from "@ant-design/icons"

const antIcon = <LoadingOutlined style={{fontSize: 24, color: "#000"}} spin />

const TaskModal = (props) => {
    const {taskData, dateOfMonth, refetch, setReward, setOpenModal, setModalChallenge} = props

    const [loading, setLoading] = useState(false)
    const [currentClaimIndex, setCurrentClaimIndex] = useState([])

    useEffect(() => {
        const modalContentElements = document.getElementsByClassName("ant-modal-content")
        for (let i = 0; i < modalContentElements.length; i++) {
            const element = modalContentElements[i]
            if (element) {
                element.style.backgroundImage = `url(${taskData.image_url})`
            }
        }
    }, [taskData])

    const generateTaskDetail = (type_action, type_reward, detail) => {
        let taskAction = "Daily task"
        let icon = <img src={advanced} alt="" />
        switch (type_action) {
            case "run":
                if (type_reward === "daily") {
                    taskAction = "Daily task"
                    icon = <img src={dailyTask} alt="" />
                } else if (type_reward === "advanced") {
                    taskAction = "Advanced task"
                    icon = <img src={advanced} alt="" />
                }
                break
            case "run_a_session":
                if (type_reward === "advanced") {
                    taskAction = "Advanced task"
                    icon = <img src={advanced} alt="" />
                }
                break
            case "zealy_task":
                if (taskData.date === "2023-06-13") {
                    taskAction = "Advanced task"
                    icon = <img src={photoTask} alt="" />
                } else {
                    taskAction = "Zealy task"
                    icon = <img src={zealyTask} alt="" />
                }
                break
            default:
                break
        }
        return {
            icon,
            taskAction,
        }
    }

    const generateTaskDescription = (type_action, detail) => {
        let description = <span>{detail}</span>
        switch (type_action) {
            case "zealy_task":
                const searchText = "Zealy FitSnap"
                const startIndex = detail.indexOf(searchText)
                const firstSubstring = detail.substring(0, startIndex)
                const secondSubstring = detail.substring(startIndex + searchText.length)
                description = (
                    <span>
                        {firstSubstring}{" "}
                        <a href="https://zealy.io/c/moonfit/questboard" target="_blank" rel="noreferrer">
                            {searchText}
                        </a>{" "}
                        {secondSubstring}
                    </span>
                )
                break
            default:
                break
        }
        return description
    }

    const onClaimTask = async (type_action, type_reward, taskIndex) => {
        try {
            setLoading(true)
            const req = {
                slug: "summer-fitsnap-challenge",
                date: taskData.date,
                type_reward,
            }
            const res = await EventService.claimSummerFitsnap(req)
            setLoading(false)
            const {success, message, data} = res.data
            if (!success) {
                return AntdMessage.error({
                    content: message,
                    className: "message-error",
                    duration: 5,
                })
            } else {
                // refetch()
                setReward(data)
                setOpenModal(true)
                setModalChallenge((prev) => ({...prev, visible: false}))
                const newClaimIndex = [...currentClaimIndex]
                const isExistIndex = currentClaimIndex.includes(taskIndex)
                if (!isExistIndex) {
                    newClaimIndex.push(taskIndex)
                }
                setCurrentClaimIndex(newClaimIndex)
            }
        } catch (e) {
            setLoading(false)
        }
    }

    return (
        <div className="task-challenge">
            {taskData && (
                <Fragment>
                    <span className="task-date">{dateOfMonth}</span>
                    <h3>{taskData.name}</h3>
                    <ul className="list-task">
                        {taskData.tasks.length &&
                            taskData.tasks.map((item, index) => {
                                const {
                                    can_claim,
                                    detail = "",
                                    type_action,
                                    type_reward,
                                    is_claimed = false,
                                    rewards = {},
                                } = item
                                return (
                                    <li className="task" key={`task_${index}`}>
                                        <div className="task-detail">
                                            {generateTaskDetail(type_action, type_reward).icon}
                                            <div className="task-description">
                                                <p>{generateTaskDetail(type_action, type_reward).taskAction}</p>
                                                {generateTaskDescription(type_action, detail)}
                                                <br />
                                                {rewards && rewards.value && (
                                                    <small style={{fontSize: "100%"}}>
                                                        You won{" "}
                                                        <small
                                                            className={
                                                                rewards.type === "MFG"
                                                                    ? "text-primary"
                                                                    : "text-secondary"
                                                            }
                                                        >
                                                            {rewards.value} {rewards.type}
                                                        </small>
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="task-claim">
                                            <Button
                                                type="primary"
                                                disabled={
                                                    !can_claim ||
                                                    is_claimed ||
                                                    currentClaimIndex.includes(index) ||
                                                    loading
                                                }
                                                onClick={() => onClaimTask(type_action, type_reward, index)}
                                                style={
                                                    is_claimed || currentClaimIndex.includes(index)
                                                        ? {padding: "0 8px"}
                                                        : null
                                                }
                                            >
                                                {/* {loading ? <Spin indicator={antIcon} /> : "Claim"} */}
                                                {is_claimed || currentClaimIndex.includes(index) ? (
                                                    <span>
                                                        <img
                                                            style={{marginRight: "2px", marginTop: "-4px"}}
                                                            src={checkCircle}
                                                            alt=""
                                                        />{" "}
                                                        Claimed
                                                    </span>
                                                ) : (
                                                    "Claim"
                                                )}
                                            </Button>
                                        </div>
                                    </li>
                                )
                            })}
                    </ul>
                </Fragment>
            )}
        </div>
    )
}

export default TaskModal
