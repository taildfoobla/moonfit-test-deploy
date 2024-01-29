import React, {useEffect, useState} from "react"
import {Button, Modal} from "antd"
import Popup from "../../assets/images/popup.png"
import RewardBg from "../../assets/images/lucky-wheel/lucky-wheel-reward-bg.jpg"
import Lottery from "../../assets/images/lottery.png"
import Packing from "../../assets/images/lucky-wheel/packing.png"
import "./styles.less"
import {setLocalStorage, LOCALSTORAGE_KEY, getLocalStorage} from "../../core/utils/helpers/storage"
import astarTicket from "../../assets/images/lucky-wheel/astar-ticket.png"
import YouWon from "../../assets/images/lucky-wheel/you-won-lucky-wheel.png"
import CloseBtn from "../../assets/images/lucky-wheel/close-border.svg"

export default function RewardModal({rewardData, isOpen, onOpenReward, renderRewardImage}) {
    // useEffect(()=>{
    //     const isFirstShow = getLocalStorage(LOCALSTORAGE_KEY.FIRST_SHOW_IN_DAY)
    //     if(!isFirstShow) {
    //         setIsModalOpen(true)
    //     }
    // },[])

    const [haveAccesToken, setHaveAccesToken] = useState(false)
    useEffect(() => {
        const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
        if (accessToken !== null) {
            setHaveAccesToken(true)
        } else {
            setHaveAccesToken(false)
        }
    }, [isOpen])

    const handleOk = () => {
        onOpenReward(false)
        if (!haveAccesToken) {
            window.open("https://onelink.to/kqzrmx")
        }
    }

    const handleCancel = () => {
        onOpenReward(false)
        // setLocalStorage(LOCALSTORAGE_KEY.FIRST_SHOW_IN_DAY,true)
    }

    const renderBtnText = () => {
        if (haveAccesToken) {
            return "Check Your In-app Wallet Now"
        } else {
            return "DOWNLOAD MOONFIT APP TO CLAIM REWARDS"
        }
    }

    return (
        <>
            <Modal
                className="lucky-wheel-reward-modal"
                open={isOpen}
                centered={true}
                onCancel={handleCancel}
                footer={false}
            >
                <div className="lucky-wheel-reward-bg">
                    <img src={RewardBg} alt="" />
                </div>
                <div className="lucky-wheel-reward-close" onClick={handleCancel}>
                    <img src={CloseBtn} alt="" />
                </div>
                <div className="lucky-wheel-reward-content">
                    <div className="lucky-wheel-reward-header">
                        <img src={YouWon} alt="" />
                    </div>
                    <div className="lucky-wheel-reward-image">
                        {/* <img src={astarTicket} alt="" /> */}
                        {renderRewardImage(rewardData.type)}
                    </div>
                    <div className="lucky-wheel-reward-text text-pink-glow-thin">{rewardData.value}{" "}{rewardData.unit}</div>
                    <div className="lucky-wheel-claim-btn" onClick={handleOk}>
                        {renderBtnText()}
                    </div>
                </div>
            </Modal>
        </>
    )
}

