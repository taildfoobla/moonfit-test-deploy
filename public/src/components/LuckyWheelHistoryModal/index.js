import "./styles.less"
import React, {useState, useEffect} from "react"
import {Modal} from "antd"
import CloseBtn from "../../assets/images/lucky-wheel/close-noborder.png"
import {getHisoryList} from "../../core/services/lucky-wheel"
import {useAuth} from "../../core/contexts/auth"
import GiftIcon from "../../assets/images/lucky-wheel/astar-ticket.png"
import HistoryBg from "../../assets/images/lucky-wheel/history-bg.png"

export default function LuckyWheelHistoryModal({isOpen, setIsOpen, historyData}) {
    const [historyList, setHistoryList] = useState([])

    const {auth} = useAuth()

    useEffect(()=>{
        if(isOpen){
            document.body.style.overflow="hidden"
        }else{
            document.body.style.overflow=""
        }
      
    },[isOpen])

    const handleCancel = () => {
        setIsOpen(false)
    }

    const handleOpenNewTab = (url) => {
        window.open(url)
    }
    const formatDate = (inputDate) => {
        const date = new Date(inputDate)

        const month = date.toLocaleString("default", {month: "short"})
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
    return (
        <div className={`lucky-wheel-history-modal-wrapper ${isOpen?"visible":""}`}>
            <div className="lucky-wheel-history-modal">
                <div
                    className="close-button"
                    onClick={() => {
                        handleCancel()
                    }}
                >
                    <img src={CloseBtn} alt="" />
                </div>
                {/* <div className="lucky-wheel-history-bg">
                <img src={HistoryBg} alt=""/>
            </div> */}
                <div className="lucky-wheel-history-modal-header">
                    <p>History</p>
                </div>
                <div className="lucky-wheel-history-list-wrapper">
                    <div className="lucky-wheel-history-list">
                        {historyData?.length > 0 ? (
                            historyData.map((item) => (
                                <div
                                    key={item.id}
                                    className="lucky-wheel-history-item"
                                    onClick={() => {
                                        handleOpenNewTab(item.scanUrl)
                                    }}
                                >
                                    <div className="gift-icon">
                                        <img src={item.rewards[0].icon} alt="" />
                                    </div>
                                    <div className="gift-content">
                                        <p className="gift-text">
                                            You won{" "}
                                            <span style={{color: `#${item.rewards[0].color}`}}>
                                                {item.rewards[0].value + " " + item.rewards[0].unit}
                                            </span>
                                        </p>
                                        <p className="gift-time">{formatDate(item.created_at)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-history">No history</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

