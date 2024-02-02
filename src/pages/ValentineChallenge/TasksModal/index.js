import React from "react"
import "./styles.less"
import advanced from "../../../assets/images/summer/advanced.svg"
import photoTask from "../../../assets/images/summer/photo-task.svg"
import zealyTask from "../../../assets/images/summer/zealy-task.svg"
import dailyTask from "../../../assets/images/summer/daily-task.svg"
import checkCircle from "../../../assets/images/summer/check-circle.svg"
import Bg1 from "../../../assets/images/christmas-challenge/bg1.png"
import Bg2 from "../../../assets/images/christmas-challenge/bg2.png"
import Bg3 from "../../../assets/images/christmas-challenge/bg3.png"
import {useEffect} from "react"
import EventService from "../../../core/services/event"
import {Button, message as AntdMessage, Spin} from "antd"
import {useState} from "react"
import {Fragment} from "react"
import {LoadingOutlined} from "@ant-design/icons"
import MFModal from "../../../components/MFModal"
import ClaimModal from "../ClaimModal"
import { useAuth } from "../../../core/contexts/auth"

const antIcon = <LoadingOutlined style={{fontSize: 24, color: "#000"}} spin />

const TaskModal = (props) => {
    const {taskData, dateOfMonth, refetch, setReward, setOpenModal, setModalChallenge, toggle,backgroundData} = props
    const {auth}=useAuth()
    const {user}=auth
    const [loading, setLoading] = useState(false)
    const [currentClaimIndex, setCurrentClaimIndex] = useState([])
    const [openRewardModal, setOpenRewardModal] = useState(false)
    const [taskIndex, setTaskIndex] = useState("")
    const [typeReward, setTypeReward] = useState("")
    const [listBg,setListBg]=useState([Bg1,Bg2,Bg3])
    const [randomNumberBg,setRandomNumberBg] =useState(0)

    useEffect(() => {
        let randomNumber = Math.round(Math.random()*2)
        setRandomNumberBg(randomNumber)
 
       
    }, [])

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
                const searchText = "Zealy Task"
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

    const onOpenModalClaim = (typeReward, taskIndex) => {
        setOpenRewardModal(true)
        setTypeReward(typeReward)
        setTaskIndex(taskIndex)
        toggle()
    }

    const onClaimTask = async (type_reward, taskIndex) => {
     
        try {
            setLoading(true)
            const req = {
                slug: "valentine-challenge-2024",
                date: taskData.date,
                type_reward,
                wallet_address:user.account
            }
            const res = await EventService.claimAdvent(req)
            // setLoading(false)
            // setOpenModal(true)
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

    const onOpenRewardModal = () => {
        setOpenRewardModal(true)
    }

    const onCloseRewardModal = () => {
        setOpenRewardModal(false)
        
    }
   
    return (
        <div className="task-challenge">
            <div className="task-bg" style={{backgroundColor:taskData.background,boxShadow:`0px 4px 44px ${taskData.background}`}}>
                {/* <img src={backgroundData[randomNumberBg]} alt=""/> */}
            </div>
            {/* <MFModal
                visible={openRewardModal}
                width={488}
                centered={true}
                footer={false}
                className={`christmas-challenge-claim ${
                    "token" === "token" ? "modal-reward-token-container" : "modal-reward-item-container"
                }`}
                maskClosable={false}
                onCancel={() => onCloseRewardModal()}
            >
                <ClaimModal
                    reward={{type: "token"}}
                    toggle={() => onCloseRewardModal()}
                    onClaimTask={onClaimTask}
                    type_reward={typeReward}
                    index={taskIndex}
                />
            </MFModal> */}
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
                                    is_claimed ,
                                    rewards = {},
                                    rewards_detail
                                } = item
                          
                                return (
                                    <li className="task" key={`task_${index}`}>
                                        <div className="task-detail">
                                            {generateTaskDetail(type_action, type_reward).icon}
                                            <div className="task-description">
                                                <p>{generateTaskDetail(type_action, type_reward).taskAction}</p>
                                                {generateTaskDescription(type_action, detail)}
                                                <br />
                                                {is_claimed && (
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
                                        <div className="task-claim" 
                                        // style={{minWidth:`${is_claimed?"30%":""}`}}
                                        >
                                            <Button
                                                type="primary"
                                                disabled={
                                                    !can_claim ||
                                                    is_claimed 
                                                    // ||
                                                    // currentClaimIndex.includes(index) ||
                                                    // loading
                                                }
                                                // onClick={() => onClaimTask(type_action, type_reward, index)}
                                                onClick={() => {
                                                    // onOpenModalClaim(type_reward, index)
                                                    onClaimTask(type_reward,index)
                                                }}
                                                // style={
                                                //     is_claimed || currentClaimIndex.includes(index)
                                                //         ? {padding: "0 8px"}
                                                //         : null
                                                // }
                                            >
                                                {/* {loading ? <Spin indicator={antIcon} /> : "Claim"} */}
                                                {is_claimed || currentClaimIndex.includes(index) ? (
                                                  <span style={{display:"flex",alignItems:"center",gap:"5px",justifyContent:"center"}}>
                                                    <img
                                                            style={{marginRight: "2px"}}
                                                            src={checkCircle}
                                                            alt=""
                                                        />{" "}
                                                        <span>
                                                      
                                                      Claimed
                                                  </span>
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

