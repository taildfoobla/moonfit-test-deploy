import React from "react"
import "./styles.less"
import {Modal} from "antd"
import closeIcon from "../../assets/images/bounty-spin/close-no-border-color-white.png"
import astrIcon from "../../assets/images/lucky-wheel/wheel/astar-wheel.png"
import noRewardIcon from "../../assets/images/bounty-spin/no-reward.png"
import zealyTaskIcon from "../../assets/images/bounty-spin/zealy-task.png"
import inviteTaskIcon from "../../assets/images/bounty-spin/invite-task.png"

export default function WheelHistoryModal({name, isOpen, onClose, historyData}) {
    const formatDate = (inputDate) => {
        const date = new Date(inputDate)

        const month = date.toLocaleString("en-US", {month: "short"})
        const day = date.getDate()
        const year = date.getFullYear()

        const hours = date.getHours()
        const minutes = date.getMinutes()
        const amOrPm = hours >= 12 ? "pm" : "am"
        const formattedHours = hours % 12 || 12

        const formattedDate = `${month} ${day} ${year} at ${formattedHours}:${minutes
            .toString()
            .padStart(2, "0")} ${amOrPm}`

        return formattedDate
    }

    const handleDisplayScrollbar = (e) => {
        let timeOut
        clearTimeout(timeOut)
        e.target.classList.add("display-scrollbar")
        timeOut = setTimeout(() => {
            e.target.classList.remove("display-scrollbar")
        }, 2000)
    }

    const handleRenderText = (reward,source=null) => {
        switch (reward.type) {
            case "ASTR":
                return (
                    
                    <p>
                        You won <span style={{color: `#00F0FF`}}>${reward.value + " " + reward.unit}</span>
                    </p>
                )
            case "MFR":
                return (
                    <p>
                        You won <span style={{color: `#E4007B`}}>{reward.value + " " + reward.unit}</span>
                    </p>
                )
            case "oMFG":
                return (
                    <p>
                        You won <span style={{color: `#4CCBC9`}}>${reward.value + " " + reward.unit}</span>
                    </p>
                )
            case "GLMR":
                return (
                    <p>
                        You won <span style={{color: `#FFF`}}>${reward.value + " " + reward.unit}</span>
                    </p>
                )
            case "FreeSpin":
                if(source ==="zealy_task"){
                    return (
                        <p>
                            You got <span style={{color: `#FFED10`}}>{reward.value} extra spins</span> from <span style={{color:"#E4007B"}}>Zealy Task</span>
                        </p>
                    )
                }else{
                    return (
                        <p>
                            You got <span style={{color: `#FFED10`}}>{reward.value} extra spins</span> from <span style={{color:"#E4007B"}}>Invite Friends</span>
                        </p>
                    )
                }
               
            default:
                return (
                    <p>
                        You won <span style={{color: `#FFF`}}>${reward.value + " " + reward.unit}</span>
                    </p>
                )
        }

        // return (
        //     <p>
        //         You won{" "}
        //         <span style={{color: `#${reward.color}`}}>
        //             {reward.value + " " + reward.unit}
        //         </span>
        //     </p>
        // )
    }

    const handleRenderImg=(item,source)=>{
        if(source){
            if(source ==="zealy_task"){
                return  <img src={zealyTaskIcon} alt="" />

            }else{
                return  <img src={inviteTaskIcon} alt="" />
            }
        
        }else{
            return      <img src={item.rewards[0].icon} alt="" />
        }
   

    }

    return (
        <Modal
            className={`wheel-history-modal ${name}`}
            open={isOpen}
            onCancel={onClose}
            footer={false}
            centered={true}
        >
            <div className="border-gradient"></div>
            <button className="close-button" onClick={onClose}>
                <img src={closeIcon} alt="" />
            </button>
            <div className="content">
                <h3>History</h3>
                <ul
                    className="history-list"
                    onScroll={(e) => {
                        handleDisplayScrollbar(e)
                    }}
                >
                    {historyData?.length > 0 ? (
                        historyData.map((item, index) => {
                            return (
                                <li className="history-item" key={index}>
                                 {handleRenderImg(item,item.source)}
                                    <div className="text">
                                        {/* <p>
                                            You won{" "}
                                            <span style={{color: `#${item.rewards[0].color}`}}>
                                                {item.rewards[0].value + " " + item.rewards[0].unit}
                                            </span>
                                        </p> */}
                                        {handleRenderText(item.rewards[0],item.source)}
                                        <p className="time">{formatDate(item.created_at)}</p>
                                    </div>
                                </li>
                            )
                        })
                    ) : (
                        <div className="no-history">
                            <img src={noRewardIcon} alt="" />
                            <p>You have no rewards!</p>
                        </div>
                    )}
                </ul>
            </div>
        </Modal>
    )
}

