import {message as AntdMessage, Button} from "antd"
import React, {Fragment, useEffect, useState} from "react"
import algemIcon from "../../../assets/images/algem/algem.svg"
import mfIcon from "../../../assets/images/algem/mf-icon.svg"
import advanced from "../../../assets/images/summer/advanced.svg"
import checkCircle from "../../../assets/images/summer/check-circle.svg"
import dailyTask from "../../../assets/images/summer/daily-task.svg"
import zealyTask from "../../../assets/images/summer/zealy-task.svg"
import EventService from "../../../core/services/event"
import "./styles.less"

const TaskModal = (props) => {
    const {taskData, setReward, setOpenModal, visible, setModalChallenge, taskIndex} = props

    const [loading, setLoading] = useState(false)
    const [currentClaimIndex, setCurrentClaimIndex] = useState([])

    useEffect(() => {
        const elements = Array.from(document.querySelectorAll(".starfish-event-tasks-modal > .ant-modal-content"))
        elements[elements.length - 1].style.backgroundImage = `url(${taskData.image_url})`
        return () => {}
    }, [visible, taskData])

    const generateTaskDetail = (type_action, type_reward, index) => {
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
                if (taskIndex === 4) {
                    taskAction = "Daily task"
                    icon = <img src={mfIcon} alt="" />
                }
                break
            case "mint_nft":
            case "run_a_session":
                if (type_reward === "advanced") {
                    taskAction = "Advanced task"
                    icon = <img src={advanced} alt="" />
                }
                break
            case "zealy_task":
                taskAction = "Zealy task"
                icon = <img src={zealyTask} alt="" />
                break
            case "stake_astr":
                taskAction = "Advanced task"
                icon = <img src={algemIcon} alt="" />
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
            case "sean_task":
                const searchSeanText = "Starfish MODs"
                const startSeanIndex = detail.indexOf(searchSeanText)
                const firstSeanSubstring = detail.substring(0, startSeanIndex)
                const secondSeanSubstring = detail.substring(startSeanIndex + searchSeanText.length)
                description = (
                    <span>
                        {firstSeanSubstring}{" "}
                        <a
                            href="https://discord.com/invite/8hDZuXQnsX"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {searchSeanText}
                        </a>{" "}
                        {secondSeanSubstring}
                    </span>
                )
                break
            case "mint_nft":
                const searchMintText = "Mint MoonFit NFTs"
                const startMintIndex = detail.indexOf(searchMintText)
                const firstMintSubstring = detail.substring(0, startMintIndex)
                const secondMintSubstring = detail.substring(startMintIndex + searchMintText.length)
                description = (
                    <span>
                        {firstMintSubstring}{" "}
                        <a href="https://app.moonfit.xyz/nft-sale-round-3" target="_blank" rel="noreferrer">
                            {searchMintText}
                        </a>{" "}
                        {secondMintSubstring}
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
                slug: "moonfit-x-starfish-finance-challenge",
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
                    {/* <span className="task-date">{dateOfMonth}</span> */}
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
                                    rewards_detail = "",
                                } = item
                                return (
                                    <li className="task" key={`task_${index}`}>
                                        <div className="task-detail">
                                            {generateTaskDetail(type_action, type_reward, index).icon}
                                            <div className="task-description">
                                                <p>{generateTaskDetail(type_action, type_reward, index).taskAction}</p>
                                                {generateTaskDescription(type_action, detail)}
                                                <br />
                                                {rewards_detail && (
                                                    <small style={{fontSize: "100%"}}>
                                                        You won{" "}
                                                        <small
                                                            className={
                                                                rewards.type === "MFG"
                                                                    ? "text-primary"
                                                                    : "text-secondary"
                                                            }
                                                        >
                                                            {rewards_detail}
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
